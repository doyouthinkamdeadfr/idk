import { embed } from './openrouter';

const VECTORIZE_MAX_DIMS = 1536;
function truncate(vec: number[]): number[] {
	return vec.length > VECTORIZE_MAX_DIMS ? vec.slice(0, VECTORIZE_MAX_DIMS) : vec;
}

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

export interface ChunkResult {
	chunkId: string;
	documentId: string;
	documentName: string;
	content: string;
	relevance: number;
}

export async function searchSimilar(
	vectorize: VectorizeIndex,
	query: string,
	platform: App.Platform | undefined,
	topK = 10
): Promise<ChunkResult[]> {
	const queryEmbedding = await embed(query, platform);

	const result = await vectorize.query(queryEmbedding, {
		topK,
		returnMetadata: true
	});

	return result.matches.map((m: { id: string; score: number; metadata?: Record<string, string> }) => ({
		chunkId: m.id,
		documentId: m.metadata?.documentId ?? '',
		documentName: m.metadata?.documentName ?? '',
		content: m.metadata?.content ?? '',
		relevance: m.score
	}));
}

export async function indexDocument(
	vectorize: VectorizeIndex,
	db: D1Database,
	userId: string,
	documentId: string,
	text: string,
	documentName: string,
	platform: App.Platform | undefined
): Promise<void> {
	const chunks = chunkText(text);
	const vectors: { id: string; values: number[]; metadata: Record<string, string> }[] = [];

	for (let i = 0; i < chunks.length; i++) {
		const chunkContent = chunks[i];
		const embedding = await embed(chunkContent, platform);
		const chunkId = crypto.randomUUID();

		vectors.push({
			id: chunkId,
			values: truncate(embedding),
			metadata: {
				documentId,
				documentName,
				content: chunkContent,
				chunkIndex: String(i)
			}
		});

		// Keep a copy in D1 for backup/rebuild
		await db
			.prepare(
				`INSERT INTO document_chunk (id, document_id, content, embedding, chunk_index) VALUES (?, ?, ?, ?, ?)`
			)
			.bind(chunkId, documentId, chunkContent, JSON.stringify(embedding), i)
			.run();
	}

	// Batch upsert to Vectorize
	await vectorize.upsert(vectors);

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
