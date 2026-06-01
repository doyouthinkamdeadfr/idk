import { Polar } from '@polar-sh/sdk';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
	const env = (platform as any)?.env ?? {};
	const db = env.DB as D1Database;
	if (!db) return new Response(JSON.stringify({ error: 'No DB' }), { status: 500 });

	const results: any = {};
	const errors: any = {};

	const token = env.POLAR_ACCESS_TOKEN ?? '';
	results.tokenPrefix = token.slice(0, 16) + '...';
	results.tokenLength = token.length;

	// Try sandbox
	try {
		const sandbox = new Polar({ accessToken: token, server: 'sandbox' });
		await sandbox.customers.list({});
		results.sandbox = 'ok';
	} catch (e: any) {
		errors.sandbox = e.message.slice(0, 200);
	}

	// Try production
	try {
		const production = new Polar({ accessToken: token, server: 'production' });
		await production.customers.list({});
		results.production = 'ok';
	} catch (e: any) {
		errors.production = e.message.slice(0, 200);
	}

	return new Response(JSON.stringify({ results, errors }, null, 2), {
		headers: { 'content-type': 'application/json' }
	});
};
