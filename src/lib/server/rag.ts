import { search } from './supermemory';

export interface ChunkResult {
	content: string;
	relevance: number;
}

export async function searchSimilar(
	query: string,
	containerTag: string,
	platform: App.Platform | undefined,
	topK = 5
): Promise<ChunkResult[]> {
	const results = await search(query, containerTag, platform, topK);
	return results.map((r) => ({
		content: r.content,
		relevance: r.score
	}));
}

export function buildRagMessages(
	query: string,
	chunks: ChunkResult[],
	conversation: { role: string; content: string }[]
): { role: string; content: string }[] {
	let context = '';
	if (chunks.length > 0) {
		context = "Here is the context from the user's documents:\n\n";
		for (const chunk of chunks) {
			context += chunk.content + '\n\n';
		}
	}

	const systemMsg = {
		role: 'system' as const,
		content:
			"You are a helpful RAG assistant for Memory, a knowledge retrieval tool. Answer the user's question based on the provided context. If the context doesn't contain relevant information, say so."
	};

	const messages: { role: string; content: string }[] = [systemMsg];

	if (context) {
		messages.push(
			{ role: 'user', content: context },
			{ role: 'assistant', content: "I'll use that context to answer your questions." }
		);
	}

	messages.push(...conversation.slice(-10));
	messages.push({ role: 'user', content: query });

	return messages;
}
