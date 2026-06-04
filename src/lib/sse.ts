export interface SSECallbacks {
	onToken: (token: string) => void;
	onDone: (data: { messageId?: string; sources?: any[] }) => void;
	onError: (error: string) => void;
}

export async function readSSEStream(response: Response, callbacks: SSECallbacks): Promise<void> {
	if (!response.body) throw new Error('No response body');

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() ?? '';

		let eventType = '';
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed.startsWith('event: ')) {
				eventType = trimmed.slice(7);
			} else if (trimmed.startsWith('data: ')) {
				const data = trimmed.slice(6);
				if (eventType === 'token') {
					const parsed = JSON.parse(data);
					callbacks.onToken(parsed.token);
				} else if (eventType === 'done') {
					const parsed = JSON.parse(data);
					callbacks.onDone(parsed);
				} else if (eventType === 'error') {
					const parsed = JSON.parse(data);
					callbacks.onError(parsed.message);
				}
			}
		}
	}
}
