import { createAuth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

function getEnv(platform: any) {
	const env = platform?.env ?? {};
	return {
		DB: env.DB as D1Database,
		discord: env.DISCORD_CLIENT_SECRET,
		ghId: env.GH_CLIENT_ID,
		ghSecret: env.GH_CLIENT_SECRET,
		polarAccessToken: env.POLAR_ACCESS_TOKEN,
		polarWebhookSecret: env.POLAR_WEBHOOK_SECRET,
		polarProMonthlyId: env.POLAR_PRO_MONTHLY_ID,
		polarProAnnualId: env.POLAR_PRO_ANNUAL_ID,
		authSecret: env.BETTER_AUTH_SECRET
	};
}

export const GET: RequestHandler = async ({ request, platform }) => {
	const { DB, discord, ghId, ghSecret, polarAccessToken, polarWebhookSecret, polarProMonthlyId, polarProAnnualId } = getEnv(platform);
	if (!DB) return new Response('Database not found', { status: 500 });
	const auth = createAuth(DB, { discord, ghId, ghSecret, polarAccessToken, polarWebhookSecret, polarProMonthlyId, polarProAnnualId });
	return auth.handler(request);
};

export const POST: RequestHandler = async ({ request, platform }) => {
	const { DB, discord, ghId, ghSecret, polarAccessToken, polarWebhookSecret, polarProMonthlyId, polarProAnnualId } = getEnv(platform);
	if (!DB) return new Response('Database not found', { status: 500 });
	const auth = createAuth(DB, { discord, ghId, ghSecret, polarAccessToken, polarWebhookSecret, polarProMonthlyId, polarProAnnualId });
	return auth.handler(request);
};
