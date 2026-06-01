import { createAuth } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const env = (event.platform as any)?.env ?? {};
	const db = env.DB as D1Database | undefined;
	if (db) {
		const auth = createAuth(db, {
			discord: env.DISCORD_CLIENT_SECRET,
			ghId: env.GH_CLIENT_ID,
			ghSecret: env.GH_CLIENT_SECRET,
			polarAccessToken: env.POLAR_ACCESS_TOKEN,
			polarWebhookSecret: env.POLAR_WEBHOOK_SECRET,
			polarProMonthlyId: env.POLAR_PRO_MONTHLY_ID,
			polarProAnnualId: env.POLAR_PRO_ANNUAL_ID
		});
		const session = await auth.api.getSession({ headers: event.request.headers });
		event.locals.session = session;
		event.locals.user = session?.user ?? null;
	}
	return resolve(event);
};
