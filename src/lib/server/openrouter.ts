const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

interface OpenRouterConfig {
	apiKey: string;
}

interface EmbeddingResponse {
	data: { embedding: number[] }[];
}

interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string | ContentPart[];
}

interface ContentPart {
	type: 'text' | 'image_url';
	text?: string;
	image_url?: { url: string };
}

interface StreamChunk {
	choices: { delta: { content?: string } }[];
}

function getApiKey(platform: App.Platform | undefined): string {
	const env = (platform as any)?.env ?? {};
	return env.OPENROUTER_API_KEY ?? '';
}

export async function embed(text: string, platform: App.Platform | undefined): Promise<number[]> {
	const apiKey = getApiKey(platform);
	if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

	const res = await fetch(`${OPENROUTER_BASE}/embeddings`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'text-embedding-3-small',
			input: text
		})
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`OpenRouter embedding error (${res.status}): ${err}`);
	}

	const json: EmbeddingResponse = await res.json();
	return json.data[0].embedding;
}

export async function describeImage(
	base64: string,
	mime: string,
	platform: App.Platform | undefined
): Promise<string> {
	const apiKey = getApiKey(platform);
	if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

	const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-4o',
			messages: [
				{
					role: 'user',
					content: [
						{ type: 'text', text: 'Describe this image in detail for RAG retrieval. Include any visible text, objects, people, and the overall scene.' },
						{ type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } }
					]
				}
			],
			max_tokens: 500
		})
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`OpenRouter vision error (${res.status}): ${err}`);
	}

	const json: any = await res.json();
	return json.choices[0].message.content;
}

export async function chatComplete(
	messages: ChatMessage[],
	platform: App.Platform | undefined,
	onToken?: (token: string) => void,
	signal?: AbortSignal
): Promise<string> {
	const apiKey = getApiKey(platform);
	if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

	const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
		method: 'POST',
		signal,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: 'gpt-4o-mini',
			messages,
			stream: true,
			max_tokens: 2048
		})
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`OpenRouter chat error (${res.status}): ${err}`);
	}

	if (!res.body) throw new Error('No response body');

	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';
	let fullContent = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() ?? '';

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed || !trimmed.startsWith('data: ')) continue;
			const data = trimmed.slice(6);
			if (data === '[DONE]') continue;

			try {
				const chunk: StreamChunk = JSON.parse(data);
				const token = chunk.choices?.[0]?.delta?.content;
				if (token) {
					fullContent += token;
					onToken?.(token);
				}
			} catch {
				// skip malformed chunks
			}
		}
	}

	return fullContent;
}
