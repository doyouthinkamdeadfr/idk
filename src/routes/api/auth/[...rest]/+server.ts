import { createAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

function getEnv(platform: any) {
	const env = platform?.env ?? {};
	return {
		DB: env.DB as D1Database,
		discord: (env.DISCORD_CLIENT_SECRET as string) ?? '',
		ghId: (env.GH_CLIENT_ID as string) ?? 'Ov23lixgrqitsY6VUiD5',
		ghSecret: (env.GH_CLIENT_SECRET as string) ?? 'f8738cddfd521ef2c3bd7e26f1382dad5122c763'
	};
}

export const GET: RequestHandler = async ({ request, platform }) => {
	const { DB, discord, ghId, ghSecret } = getEnv(platform);
	if (!DB) return new Response('Database not found', { status: 500 });
	const auth = createAuth(DB, { discord, ghId, ghSecret });
	return auth.handler(request);
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const { DB, discord, ghId, ghSecret } = getEnv(platform);
	if (!DB) return new Response('Database not found', { status: 500 });
	const auth = createAuth(DB, { discord, ghId, ghSecret });
	return auth.handler(request);
};
