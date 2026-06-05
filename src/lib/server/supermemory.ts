const BASE = 'https://api.supermemory.ai';

function getKey(platform: App.Platform | undefined): string {
	return ((platform as any)?.env as any)?.SUPERMEMORY_API_KEY ?? '';
}

async function smFetch(path: string, apiKey: string, options: RequestInit = {}): Promise<Response> {
	const res = await fetch(`${BASE}${path}`, {
		...options,
		headers: {
			...options.headers as Record<string, string>,
			Authorization: `Bearer ${apiKey}`
		}
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Supermemory error (${res.status}): ${err.slice(0, 500)}`);
	}
	return res;
}

export async function ingestText(text: string, containerTag: string, platform: App.Platform | undefined): Promise<string> {
	const apiKey = getKey(platform);
	if (!apiKey) throw new Error('SUPERMEMORY_API_KEY not configured');

	const res = await smFetch('/v3/documents', apiKey, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			content: text,
			containerTag
		})
	});
	const json: any = await res.json();
	return json.id;
}

export async function uploadFile(buffer: ArrayBuffer, name: string, mime: string, containerTag: string, platform: App.Platform | undefined): Promise<string> {
	const apiKey = getKey(platform);
	if (!apiKey) throw new Error('SUPERMEMORY_API_KEY not configured');

	const blob = new Blob([buffer], { type: mime });
	const form = new FormData();
	form.append('file', blob, name);
	form.append('containerTag', containerTag);

	const res = await smFetch('/v3/documents/file', apiKey, {
		method: 'POST',
		body: form
	});
	const json: any = await res.json();
	return json.id;
}

export async function getDocument(id: string, platform: App.Platform | undefined): Promise<{ id: string; status: string }> {
	const apiKey = getKey(platform);
	if (!apiKey) throw new Error('SUPERMEMORY_API_KEY not configured');

	const res = await smFetch(`/v3/documents/${id}`, apiKey);
	const json: any = await res.json();
	return { id: json.id, status: json.status };
}

export async function waitForProcessing(id: string, platform: App.Platform | undefined, timeoutMs = 30000): Promise<void> {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		const doc = await getDocument(id, platform);
		if (doc.status === 'done') return;
		if (doc.status === 'failed') throw new Error(`Supermemory processing failed for document ${id}`);
		await new Promise(r => setTimeout(r, 500));
	}
	throw new Error(`Supermemory processing timed out for document ${id}`);
}

export async function search(query: string, containerTag: string, platform: App.Platform | undefined, limit = 5): Promise<{ content: string; score: number }[]> {
	const apiKey = getKey(platform);
	if (!apiKey) throw new Error('SUPERMEMORY_API_KEY not configured');

	const res = await smFetch('/v4/search', apiKey, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			q: query,
			containerTag,
			searchMode: 'hybrid',
			limit,
			threshold: 0.5
		})
	});
	const json: any = await res.json();
	return (json.results || []).map((r: any) => ({
		content: r.memory || r.chunk || '',
		score: r.similarity ?? 0
	}));
}
