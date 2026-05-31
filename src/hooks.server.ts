import { createAuth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const env = (event.platform as any)?.env ?? {};
	const db = env.DB as D1Database | undefined;
	if (db) {
		const auth = createAuth(db, {
			discord: (env.DISCORD_CLIENT_SECRET as string) ?? '',
			ghId: (env.GH_CLIENT_ID as string) ?? 'Ov23lixgrqitsY6VUiD5',
			ghSecret: (env.GH_CLIENT_SECRET as string) ?? 'f8738cddfd521ef2c3bd7e26f1382dad5122c763'
		});
		const session = await auth.api.getSession({ headers: event.request.headers });
		event.locals.session = session;
		event.locals.user = session?.user ?? null;
	}
	return resolve(event);
};
