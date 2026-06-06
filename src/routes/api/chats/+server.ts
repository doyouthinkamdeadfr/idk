import type { RequestHandler } from './$types';

function unauthorized(): Response {
	return new Response(JSON.stringify({ error: 'Unauthorized' }), {
		status: 401,
		headers: { 'content-type': 'application/json' }
	});
}

export const GET: RequestHandler = async ({ locals, platform }) => {
	if (!locals.user) return unauthorized();
	const db = ((platform as any)?.env as any)?.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	const { results } = await db
		.prepare(
			`SELECT id, title, pinned, archived, created_at, updated_at FROM chat WHERE user_id = ? ORDER BY updated_at DESC`
		)
		.bind(locals.user.id)
		.all();

	return new Response(JSON.stringify(results), { headers: { 'content-type': 'application/json' } });
};

export const POST: RequestHandler = async ({ request, locals, platform }) => {
	if (!locals.user) return unauthorized();
	const db = ((platform as any)?.env as any)?.DB as D1Database;
	if (!db) return new Response('Database not found', { status: 500 });

	const { title } = await request.json();
	const id = crypto.randomUUID();
	const now = new Date().toISOString();

	await db
		.prepare(`INSERT INTO chat (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`)
		.bind(id, locals.user.id, title ?? 'New Chat', now, now)
		.run();

	return new Response(JSON.stringify({ id, title: title ?? 'New Chat', createdAt: now }), {
		status: 201,
		headers: { 'content-type': 'application/json' }
	});
};
