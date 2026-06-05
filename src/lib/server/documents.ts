import { ingestText, uploadFile } from './supermemory';

export async function ingestDocument(
	buffer: ArrayBuffer,
	name: string,
	mime: string,
	userId: string,
	platform: App.Platform | undefined
): Promise<string> {
	return await uploadFile(buffer, name, mime, userId, platform);
}

export async function ingestLink(
	url: string,
	userId: string,
	platform: App.Platform | undefined
): Promise<string> {
	return await ingestText(url, userId, platform);
}

export function getMimeType(name: string, buffer: ArrayBuffer): string {
	const arr = new Uint8Array(buffer.slice(0, 4));
	const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');

	if (hex.startsWith('89504e47')) return 'image/png';
	if (hex.startsWith('ffd8')) return 'image/jpeg';
	if (hex.startsWith('474946')) return 'image/gif';
	if (hex.startsWith('52494646')) return 'image/webp';

	if (name.endsWith('.md')) return 'text/markdown';
	if (name.endsWith('.txt')) return 'text/plain';

	return 'application/octet-stream';
}
