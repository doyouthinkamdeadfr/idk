import type { RequestHandler } from './$types';

function unauthorized(): Response {
	return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
}

export const PATCH: RequestHandler = async ({ params, request, locals, platform }) => {
	if (!locals.user) return unauthorized();
	const db = ((platform as any)?.env as any)?.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	const { title, pinned, archived } = await request.json();
	const now = new Date().toISOString();

	const sets: string[] = [];
	const vals: any[] = [];

	if (title !== undefined) { sets.push('title = ?'); vals.push(title); }
	if (pinned !== undefined) { sets.push('pinned = ?'); vals.push(pinned ? 1 : 0); }
	if (archived !== undefined) { sets.push('archived = ?'); vals.push(archived ? 1 : 0); }
	sets.push('updated_at = ?');
	vals.push(now);

	vals.push(params.id);
	vals.push(locals.user.id);

	await db
		.prepare(`UPDATE chat SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`)
		.bind(...vals)
		.run();

	return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};

export const DELETE: RequestHandler = async ({ params, locals, platform }) => {
	if (!locals.user) return unauthorized();
	const db = ((platform as any)?.env as any)?.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	// Delete in order: messages → chat_document → chat
	await db.prepare(`DELETE FROM message WHERE chat_id = ?`).bind(params.id).run();
	await db.prepare(`DELETE FROM chat_document WHERE chat_id = ?`).bind(params.id).run();
	await db.prepare(`DELETE FROM chat WHERE id = ? AND user_id = ?`).bind(params.id, locals.user.id).run();

	return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
