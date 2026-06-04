import { embed } from './openrouter';

const EMBEDDING_DIMS = 256;

export function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
	const chunks: string[] = [];
	let i = 0;

	while (i < text.length) {
		const end = Math.min(i + chunkSize, text.length);
		chunks.push(text.slice(i, end));
		i += chunkSize - overlap;
		if (i >= text.length) break;
	}

	return chunks;
}

export function cosineSimilarity(a: number[], b: number[]): number {
	let dot = 0, normA = 0, normB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		normA += a[i] * a[i];
		normB += b[i] * b[i];
	}
	const denom = Math.sqrt(normA) * Math.sqrt(normB);
	return denom === 0 ? 0 : dot / denom;
}

export interface ChunkResult {
	chunkId: string;
	documentId: string;
	documentName: string;
	content: string;
	relevance: number;
}

export async function searchSimilar(
	db: D1Database,
	userId: string,
	query: string,
	platform: App.Platform | undefined,
	topK = 10
): Promise<ChunkResult[]> {
	const queryEmbedding = await embed(query, platform);

	const stmt = db.prepare(`
		SELECT dc.id, dc.document_id, dc.content, dc.embedding, d.name as document_name
		FROM document_chunk dc
		JOIN document d ON d.id = dc.document_id
		WHERE d.user_id = ? AND d.status = 'ready'
	`);
	const { results } = await stmt.bind(userId).all() as any;

	const scored: ChunkResult[] = [];
	for (const row of results) {
		const stored: number[] = JSON.parse(row.embedding);
		const relevance = cosineSimilarity(queryEmbedding, stored);
		scored.push({
			chunkId: row.id,
			documentId: row.document_id,
			documentName: row.document_name,
			content: row.content,
			relevance
		});
	}

	scored.sort((a, b) => b.relevance - a.relevance);
	return scored.slice(0, topK);
}

export async function indexDocument(
	db: D1Database,
	userId: string,
	documentId: string,
	text: string,
	platform: App.Platform | undefined
): Promise<void> {
	const chunks = chunkText(text);

	for (let i = 0; i < chunks.length; i++) {
		const chunkContent = chunks[i];
		const embedding = await embed(chunkContent, platform);
		const embeddingJson = JSON.stringify(embedding);

		await db
			.prepare(
				`INSERT INTO document_chunk (id, document_id, content, embedding, chunk_index) VALUES (?, ?, ?, ?, ?)`
			)
			.bind(crypto.randomUUID(), documentId, chunkContent, embeddingJson, i)
			.run();
	}

	await db
		.prepare(`UPDATE document SET status = 'ready', updated_at = ? WHERE id = ?`)
		.bind(new Date().toISOString(), documentId)
		.run();
}

export function buildRagPrompt(query: string, chunks: ChunkResult[]): string {
	let context = 'Here is the context from the user\'s documents:\n\n';
	for (const chunk of chunks) {
		context += `---[${chunk.documentName}]---\n${chunk.content}\n\n`;
	}

	return context;
}

export function buildRagMessages(query: string, chunks: ChunkResult[], conversation: { role: string; content: string }[]): { role: string; content: string | { type: string; text?: string }[] }[] {
	const context = buildRagPrompt(query, chunks);

	const systemMsg = {
		role: 'system' as const,
		content: `You are a helpful RAG assistant for Memory, a knowledge retrieval tool. Answer the user's question based on the provided context. If the context doesn't contain relevant information, say so. Always cite sources using [Source: filename] notation when possible.`
	};

	const contextMsg = {
		role: 'user' as const,
		content: context
	};

	const assistantAck = {
		role: 'assistant' as const,
		content: 'I\'ll use that context to answer your questions.'
	};

	const queryMsg = {
		role: 'user' as const,
		content: query
	};

	return [systemMsg, contextMsg, assistantAck, ...conversation.slice(-10), queryMsg];
}

export async function isWithinFreeLimit(db: D1Database, userId: string): Promise<boolean> {
	const { results }: any = await db
		.prepare(`SELECT COUNT(*) as count FROM document_chunk dc JOIN document d ON d.id = dc.document_id WHERE d.user_id = ?`)
		.bind(userId)
		.all();

	const count = (results[0] as any)?.count ?? 0;
	return count < 5000;
}
