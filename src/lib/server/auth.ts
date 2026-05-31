import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { schema } from '$db/schema';

export function createAuth(
	db: D1Database,
	secrets: { discord?: string; ghId?: string; ghSecret?: string } = {}
) {
	return betterAuth({
		database: drizzleAdapter(drizzle(db), {
			provider: 'sqlite',
			schema
		}),
		emailAndPassword: {
			enabled: true
		},
		socialProviders: {
			discord: {
				clientId: '1510238978408710216',
				clientSecret: secrets.discord ?? ''
			},
			github: {
				clientId: secrets.ghId ?? '',
				clientSecret: secrets.ghSecret ?? ''
			}
		}
	});
}
