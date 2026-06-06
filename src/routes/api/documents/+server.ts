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
			`SELECT id, name, type, mime, size, status, error, created_at, updated_at FROM document WHERE user_id = ? ORDER BY created_at DESC`
		)
		.bind(locals.user.id)
		.all();

	return new Response(JSON.stringify(results), { headers: { 'content-type': 'application/json' } });
};
