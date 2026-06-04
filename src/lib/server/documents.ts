import { describeImage } from './openrouter';

const TEXT_MIMES = ['text/plain', 'text/markdown', 'text/x-markdown', 'application/octet-stream'];
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function extractTextFromFile(buffer: ArrayBuffer, mime: string, name: string): string {
	if (IMAGE_MIMES.includes(mime)) {
		throw new Error('IMAGE_NEEDS_VISION');
	}

	if (TEXT_MIMES.includes(mime) || name.endsWith('.txt') || name.endsWith('.md')) {
		return new TextDecoder().decode(buffer);
	}

	throw new Error(`Unsupported file type: ${mime}. Supported: .txt, .md, images`);
}

export async function extractTextFromImage(
	buffer: ArrayBuffer,
	mime: string,
	platform: App.Platform | undefined
): Promise<string> {
	const base64 = arrayBufferToBase64(buffer);
	return describeImage(base64, mime, platform);
}

export async function fetchLinkContent(url: string): Promise<string> {
	try {
		const res = await fetch(url, {
			headers: {
				'User-Agent': 'Memory-RAG/1.0 (knowledge retrieval bot)'
			}
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);

		const html = await res.text();
		const text = stripHtml(html).trim();

		if (text.length < 100) {
			throw new Error('Could not extract meaningful content from this URL');
		}

		return text;
	} catch (e: any) {
		throw new Error(`Failed to fetch URL: ${e.message}`);
	}
}

export function getMimeType(name: string, buffer: ArrayBuffer): string {
	// Check magic bytes for images
	const arr = new Uint8Array(buffer.slice(0, 4));
	const hex = Array.from(arr)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	if (hex.startsWith('89504e47')) return 'image/png';
	if (hex.startsWith('ffd8')) return 'image/jpeg';
	if (hex.startsWith('474946')) return 'image/gif';
	if (hex.startsWith('52494646')) return 'image/webp';

	if (name.endsWith('.md')) return 'text/markdown';
	if (name.endsWith('.txt')) return 'text/plain';

	return 'application/octet-stream';
}

function stripHtml(html: string): string {
	return html
		.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
		.replace(/<nav[\s\S]*?>[\s\S]*?<\/nav>/gi, '')
		.replace(/<footer[\s\S]*?>[\s\S]*?<\/footer>/gi, '')
		.replace(/<header[\s\S]*?>[\s\S]*?<\/header>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&[^;]+;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}
