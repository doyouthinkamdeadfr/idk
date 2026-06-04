import { indexDocument, searchSimilar, buildRagMessages } from '$lib/server/rag';
import { extractTextFromFile, extractTextFromImage, fetchLinkContent, getMimeType } from '$lib/server/documents';
import { chatComplete } from '$lib/server/openrouter';
import type { RequestHandler } from './$types';

function unauthorized(): Response {
	return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
}

export const GET: RequestHandler = async ({ params, locals, platform }) => {
	if (!locals.user) return unauthorized();
	const db = ((platform as any)?.env as any)?.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	const { results } = await db
		.prepare(`SELECT id, role, content, attachments, sources, created_at FROM message WHERE chat_id = ? ORDER BY created_at ASC`)
		.bind(params.id)
		.all();

	return new Response(JSON.stringify(results), { headers: { 'content-type': 'application/json' } });
};

export const POST: RequestHandler = async ({ params, request, locals, platform }) => {
	if (!locals.user) return unauthorized();
	const db = ((platform as any)?.env as any)?.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	const form = await request.formData();
	const text = (form.get('text') as string) ?? '';
	const linksRaw = form.get('links');
	const fileEntries = form.getAll('files[]') as File[];
	const links: string[] = linksRaw ? JSON.parse(linksRaw as string) : [];

	// Verify chat belongs to user
	const chat = await db.prepare(`SELECT id FROM chat WHERE id = ? AND user_id = ?`).bind(params.id, locals.user.id).first();
	if (!chat) return new Response('Chat not found', { status: 404 });

	const now = new Date().toISOString();
	const attachmentInfos: { type: string; name: string; documentId?: string; url?: string }[] = [];

	// Process files
	for (const file of fileEntries) {
		const buf = await file.arrayBuffer();
		const mime = getMimeType(file.name, buf);
		const docId = crypto.randomUUID();

		await db
			.prepare(`INSERT INTO document (id, user_id, name, type, mime, size, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'processing', ?, ?)`)
			.bind(docId, locals.user.id, file.name, file.type === 'image' ? 'image' : 'file', mime, buf.byteLength, now, now)
			.run();

		try {
			let extractedText: string;
			if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mime)) {
				extractedText = await extractTextFromImage(buf, mime, platform);
			} else {
				extractedText = extractTextFromFile(buf, mime, file.name);
			}

			await db
				.prepare(`UPDATE document SET content = ?, updated_at = ? WHERE id = ?`)
				.bind(extractedText, now, docId)
				.run();

			await indexDocument(db, locals.user.id, docId, extractedText, platform);
		} catch (e: any) {
			await db
				.prepare(`UPDATE document SET status = 'error', error = ?, updated_at = ? WHERE id = ?`)
				.bind(e.message.slice(0, 500), now, docId)
				.run();
		}

		// Link doc to chat
		await db.prepare(`INSERT OR IGNORE INTO chat_document (chat_id, document_id) VALUES (?, ?)`).bind(params.id, docId).run();

		attachmentInfos.push({ type: file.type === 'image' ? 'image' : 'file', name: file.name, documentId: docId });
	}

	// Process links
	for (const url of links) {
		const docId = crypto.randomUUID();
		await db
			.prepare(`INSERT INTO document (id, user_id, name, type, mime, status, created_at, updated_at) VALUES (?, ?, ?, 'link', 'text/html', 'processing', ?, ?)`)
			.bind(docId, locals.user.id, url, now, now)
			.run();

		try {
			const content = await fetchLinkContent(url);
			await db.prepare(`UPDATE document SET content = ?, updated_at = ? WHERE id = ?`).bind(content, now, docId).run();
			await indexDocument(db, locals.user.id, docId, content, platform);
		} catch (e: any) {
			await db
				.prepare(`UPDATE document SET status = 'error', error = ?, updated_at = ? WHERE id = ?`)
				.bind(e.message.slice(0, 500), now, docId)
				.run();
		}

		await db.prepare(`INSERT OR IGNORE INTO chat_document (chat_id, document_id) VALUES (?, ?)`).bind(params.id, docId).run();
		attachmentInfos.push({ type: 'link', name: url, url, documentId: docId });
	}

	// Save user message
	const userMsgId = crypto.randomUUID();
	const attachmentsJson = attachmentInfos.length > 0 ? JSON.stringify(attachmentInfos) : null;
	await db
		.prepare(`INSERT INTO message (id, chat_id, user_id, role, content, attachments, created_at) VALUES (?, ?, ?, 'user', ?, ?, ?)`)
		.bind(userMsgId, params.id, locals.user.id, text || '(attachment only)', attachmentsJson, now)
		.run();

	// Update chat timestamp
	await db.prepare(`UPDATE chat SET updated_at = ? WHERE id = ?`).bind(now, params.id).run();

	// Build title from first message
	const firstMsg = await db.prepare(`SELECT COUNT(*) as cnt FROM message WHERE chat_id = ?`).bind(params.id).first() as any;
	if (firstMsg?.cnt === 1) {
		const title = text ? text.slice(0, 80) : (attachmentInfos[0]?.name ?? 'New Chat');
		await db.prepare(`UPDATE chat SET title = ? WHERE id = ?`).bind(title, params.id).run();
	}

	// SSE streaming response
	const userId = locals.user.id;
	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			function send(event: string, data: any) {
				controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
			}

			try {
				// Set chat as the context source (only for this message's attachments)
				const allDocs = await db
					.prepare(`SELECT d.id, d.name, d.content FROM document d JOIN chat_document cd ON cd.document_id = d.id WHERE cd.chat_id = ? AND d.status = 'ready'`)
					.bind(params.id)
					.all() as any;

				let contextChunks: any[] = [];

				if (text.trim()) {
					// Search across all user documents
					const searchResults = await searchSimilar(db, userId, text, platform, 10);
					contextChunks = searchResults;
				}

				// Get conversation history
				const history = (await db
					.prepare(`SELECT role, content FROM message WHERE chat_id = ? ORDER BY created_at ASC`)
					.bind(params.id)
					.all() as any).results ?? [];

				const messages = buildRagMessages(text, contextChunks, history);

				let fullContent = '';
				await chatComplete(
					messages as any,
					platform,
					(token) => {
						fullContent += token;
						send('token', { token });
					}
				);

				const sources = contextChunks.map((c) => ({
					documentId: c.documentId,
					name: c.documentName,
					relevance: Math.round(c.relevance * 100) / 100
				}));

				// Save assistant message
				const msgId = crypto.randomUUID();
				await db
					.prepare(`INSERT INTO message (id, chat_id, user_id, role, content, sources, created_at) VALUES (?, ?, ?, 'assistant', ?, ?, ?)`)
					.bind(msgId, params.id, userId, fullContent, sources.length > 0 ? JSON.stringify(sources) : null, new Date().toISOString())
					.run();

				send('done', { messageId: msgId, sources });

				// Update chat title after first Q&A if it's still the default
				const chatInfo = await db.prepare(`SELECT title FROM chat WHERE id = ?`).bind(params.id).first() as any;
				if (chatInfo?.title === 'New Chat' && text.trim()) {
					const newTitle = text.slice(0, 60);
					await db.prepare(`UPDATE chat SET title = ? WHERE id = ?`).bind(newTitle, params.id).run();
				}
			} catch (e: any) {
				send('error', { message: e.message });
			} finally {
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: {
			'content-type': 'text/event-stream',
			'cache-control': 'no-cache',
			connection: 'keep-alive'
		}
	});
};
