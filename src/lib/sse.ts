export async function readSSEStream(res: Response, handlers: {
	onStatus?: (msg: string) => void;
	onToken?: (token: string) => void;
	onDone?: (data: any) => void;
	onError?: (err: string) => void;
}) {
	const reader = res.body!.getReader();
	const decoder = new TextDecoder();
	let buf = '';
	let data: any = {};
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buf += decoder.decode(value, { stream: true });
		const lines = buf.split('\n');
		buf = lines.pop() || '';
		for (const line of lines) {
			if (line.startsWith('data: ')) {
				const payload = line.slice(6);
				if (payload === '[DONE]') { handlers.onDone?.(data); return; }
				try {
					const parsed = JSON.parse(payload);
					if (parsed.type === 'status') handlers.onStatus?.(parsed.message);
					else if (parsed.type === 'token') handlers.onToken?.(parsed.token);
					else if (parsed.type === 'error') handlers.onError?.(parsed.message);
					if (parsed.sources) data = { ...data, sources: parsed.sources };
				} catch { handlers.onToken?.(payload); }
			}
		}
	}
	handlers.onDone?.(data);
}
