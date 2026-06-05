const CHAT_MODEL = 'openrouter/free';

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

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

export async function chatComplete(
	messages: ChatMessage[],
	platform: App.Platform | undefined,
	onToken?: (token: string) => void,
	signal?: AbortSignal
): Promise<string> {
	const env = (platform as any)?.env ?? {};
	const apiKey = env.OPENROUTER_API_KEY as string | undefined;
	if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

	const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
		method: 'POST',
		signal,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: CHAT_MODEL,
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
