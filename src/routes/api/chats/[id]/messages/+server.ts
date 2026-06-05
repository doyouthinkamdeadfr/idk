import { ingestDocument, ingestLink } from '$lib/server/documents';
import { waitForProcessing } from '$lib/server/supermemory';
import { searchSimilar, buildRagMessages } from '$lib/server/rag';
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
	const env = (platform as any)?.env as any;
	const db = env.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	const form = await request.formData();
	const text = (form.get('text') as string) ?? '';
	const linksRaw = form.get('links');
	const fileEntries = form.getAll('files[]') as File[];
	const links: string[] = linksRaw ? JSON.parse(linksRaw as string) : [];

	const chat = await db.prepare(`SELECT id FROM chat WHERE id = ? AND user_id = ?`).bind(params.id, locals.user.id).first();
	if (!chat) return new Response('Chat not found', { status: 404 });

	const now = new Date().toISOString();
	const attachmentInfos: { type: string; name: string; documentId?: string; url?: string }[] = [];
	const smDocIds: string[] = [];

	for (const file of fileEntries) {
		const docId = crypto.randomUUID();
		const buf = await file.arrayBuffer();
		const mime = file.type || 'application/octet-stream';

		await db
			.prepare(`INSERT INTO document (id, user_id, name, type, mime, size, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'processing', ?, ?)`)
			.bind(docId, locals.user.id, file.name, file.type === 'image' ? 'image' : 'file', mime, buf.byteLength, now, now)
			.run();

		try {
			const smId = await ingestDocument(buf, file.name, mime, locals.user.id, platform);
			smDocIds.push(smId);
			await db
				.prepare(`UPDATE document SET status = 'ready', updated_at = ? WHERE id = ?`)
				.bind(now, docId)
				.run();
		} catch (e: any) {
			await db
				.prepare(`UPDATE document SET status = 'error', error = ?, updated_at = ? WHERE id = ?`)
				.bind(e.message.slice(0, 500), now, docId)
				.run();
		}

		await db.prepare(`INSERT OR IGNORE INTO chat_document (chat_id, document_id) VALUES (?, ?)`).bind(params.id, docId).run();
		attachmentInfos.push({ type: file.type === 'image' ? 'image' : 'file', name: file.name, documentId: docId });
	}

	for (const url of links) {
		const docId = crypto.randomUUID();
		await db
			.prepare(`INSERT INTO document (id, user_id, name, type, mime, status, created_at, updated_at) VALUES (?, ?, ?, 'link', 'text/html', 'processing', ?, ?)`)
			.bind(docId, locals.user.id, url, now, now)
			.run();

		try {
			const smId = await ingestLink(url, locals.user.id, platform);
			smDocIds.push(smId);
			await db
				.prepare(`UPDATE document SET status = 'ready', updated_at = ? WHERE id = ?`)
				.bind(now, docId)
				.run();
		} catch (e: any) {
			await db
				.prepare(`UPDATE document SET status = 'error', error = ?, updated_at = ? WHERE id = ?`)
				.bind(e.message.slice(0, 500), now, docId)
				.run();
		}

		await db.prepare(`INSERT OR IGNORE INTO chat_document (chat_id, document_id) VALUES (?, ?)`).bind(params.id, docId).run();
		attachmentInfos.push({ type: 'link', name: url, url, documentId: docId });
	}

	const userMsgId = crypto.randomUUID();
	const attachmentsJson = attachmentInfos.length > 0 ? JSON.stringify(attachmentInfos) : null;
	await db
		.prepare(`INSERT INTO message (id, chat_id, user_id, role, content, attachments, created_at) VALUES (?, ?, ?, 'user', ?, ?, ?)`)
		.bind(userMsgId, params.id, locals.user.id, text || '(attachment only)', attachmentsJson, now)
		.run();

	await db.prepare(`UPDATE chat SET updated_at = ? WHERE id = ?`).bind(now, params.id).run();

	const firstMsg = await db.prepare(`SELECT COUNT(*) as cnt FROM message WHERE chat_id = ?`).bind(params.id).first() as any;
	if (firstMsg?.cnt === 1) {
		const title = text ? text.slice(0, 80) : (attachmentInfos[0]?.name ?? 'New Chat');
		await db.prepare(`UPDATE chat SET title = ? WHERE id = ?`).bind(title, params.id).run();
	}

	const userId = locals.user.id;
	const stream = new ReadableStream({
		async start(controller) {
			const encoder = new TextEncoder();
			function send(data: any) {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
			}

			try {
				if (text.trim() && smDocIds.length > 0) {
					send({ type: 'status', message: 'Processing documents...' });
					await Promise.allSettled(smDocIds.map(id => waitForProcessing(id, platform).catch(() => {})));
				}

				let contextChunks: any[] = [];

				if (text.trim()) {
					send({ type: 'status', message: 'Searching documents...' });
					contextChunks = await searchSimilar(text, userId, platform);
				}

				const history = (await db
					.prepare(`SELECT role, content FROM message WHERE chat_id = ? ORDER BY created_at ASC`)
					.bind(params.id)
					.all() as any).results ?? [];

				const messages = buildRagMessages(text, contextChunks, history);

				send({ type: 'status', message: 'Generating response...' });

				let fullContent = '';
				await chatComplete(
					messages as any,
					platform,
					(token) => {
						fullContent += token;
						send({ type: 'token', token });
					}
				);

				const sources = contextChunks.map((c: any) => ({
					relevance: Math.round(c.relevance * 100) / 100
				}));

				const msgId = crypto.randomUUID();
				await db
					.prepare(`INSERT INTO message (id, chat_id, user_id, role, content, sources, created_at) VALUES (?, ?, ?, 'assistant', ?, ?, ?)`)
					.bind(msgId, params.id, userId, fullContent, sources.length > 0 ? JSON.stringify(sources) : null, new Date().toISOString())
					.run();

				send({ type: 'done', messageId: msgId, sources });
				send('[DONE]');

				const chatInfo = await db.prepare(`SELECT title FROM chat WHERE id = ?`).bind(params.id).first() as any;
				if (chatInfo?.title === 'New Chat' && text.trim()) {
					const newTitle = text.slice(0, 60);
					await db.prepare(`UPDATE chat SET title = ? WHERE id = ?`).bind(newTitle, params.id).run();
				}
			} catch (e: any) {
				send({ type: 'error', message: e.message });
				send('[DONE]');
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
