import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { schema, subscription } from '$db/schema';
import { Polar } from '@polar-sh/sdk';
import { polar, checkout, portal, webhooks } from '@polar-sh/better-auth';

export function createAuth(
	db: D1Database,
	secrets: {
		discord?: string;
		ghId?: string;
		ghSecret?: string;
		polarAccessToken?: string;
		polarWebhookSecret?: string;
		polarProMonthlyId?: string;
		polarProAnnualId?: string;
		authSecret?: string;
	} = {}
) {
	const plugins: any[] = [];

	try {
		const polarClient = new Polar({
			accessToken: secrets.polarAccessToken ?? '',
			server: 'sandbox'
		});
		plugins.push(
			polar({
				client: polarClient,
				createCustomerOnSignUp: true,
				use: [
						checkout({
							products: [
								{ productId: secrets.polarProMonthlyId ?? '60d0460e-3119-404e-b52a-b849d1ed6ad7', slug: 'pro-monthly' },
								{ productId: secrets.polarProAnnualId ?? '4169f317-7a5a-410f-8db7-e56d06381fc0', slug: 'pro-annual' }
							],
							successUrl: '/dashboard?checkout_id={CHECKOUT_ID}',
							authenticatedUsersOnly: true
						}),
						portal(),
						webhooks({
							secret: secrets.polarWebhookSecret ?? '',
							onSubscriptionActive: async (payload) => {
								const sub = payload.data;
								try {
									const d1 = drizzle(db);
									await d1
										.insert(subscription)
										.values({
											id: crypto.randomUUID(),
											userId: sub.customerExternalId ?? '',
											polarSubscriptionId: sub.id,
											polarProductId: sub.productId,
											status: sub.status,
											currentPeriodStart: sub.currentPeriodStart,
											currentPeriodEnd: sub.currentPeriodEnd,
											cancelAtPeriodEnd: sub.cancelAtPeriodEnd ? 1 : 0,
											createdAt: new Date().toISOString(),
											updatedAt: new Date().toISOString()
										})
										.onConflictDoUpdate({
											target: subscription.polarSubscriptionId,
											set: {
												status: sub.status,
												currentPeriodStart: sub.currentPeriodStart,
												currentPeriodEnd: sub.currentPeriodEnd,
												cancelAtPeriodEnd: sub.cancelAtPeriodEnd ? 1 : 0,
												updatedAt: new Date().toISOString()
											}
										});
								} catch (e) {
									console.error('Failed to sync subscription:', e);
								}
							},
							onSubscriptionCanceled: async (payload) => {
								const sub = payload.data;
								try {
									const d1 = drizzle(db);
									await d1
										.update(subscription)
										.set({
											status: 'canceled',
											cancelAtPeriodEnd: 1,
											updatedAt: new Date().toISOString()
										})
										.where(eq(subscription.polarSubscriptionId, sub.id));
								} catch (e) {
									console.error('Failed to update canceled subscription:', e);
								}
							},
							onSubscriptionRevoked: async (payload) => {
								const sub = payload.data;
								try {
									const d1 = drizzle(db);
									await d1
										.update(subscription)
										.set({
											status: 'revoked',
											updatedAt: new Date().toISOString()
										})
										.where(eq(subscription.polarSubscriptionId, sub.id));
								} catch (e) {
									console.error('Failed to update revoked subscription:', e);
								}
							}
						})
					]
				})
			);
	} catch (e) {
		console.error('Failed to initialize Polar:', e);
	}

	return betterAuth({
		database: drizzleAdapter(drizzle(db), {
			provider: 'sqlite',
			schema
		}),
		secret: secrets.authSecret,
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
		},
		plugins
	});
}
