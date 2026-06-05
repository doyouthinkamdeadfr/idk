import type { RequestHandler } from './$types';

function unauthorized(): Response {
	return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
}

export const DELETE: RequestHandler = async ({ params, locals, platform }) => {
	if (!locals.user) return unauthorized();
	const db = ((platform as any)?.env as any)?.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	await db.prepare(`DELETE FROM chat_document WHERE document_id = ?`).bind(params.id).run();
	await db.prepare(`DELETE FROM document WHERE id = ? AND user_id = ?`).bind(params.id, locals.user.id).run();

	return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
