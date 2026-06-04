declare global {
	namespace App {
		interface Locals {
			session: {
				user: {
					id: string;
					email: string;
					name: string;
					image?: string | null;
				};
				session: {
					id: string;
					expiresAt: Date;
					token: string;
					createdAt: Date;
					updatedAt: Date;
					userId: string;
					ipAddress?: string | null;
					userAgent?: string | null;
				};
			} | null;
			user: {
				id: string;
				email: string;
				name: string;
				image?: string | null;
			} | null;
		}
		interface PageData {
			session: typeof App.Locals.session;
		}
		interface Platform {
			env: { DB: D1Database; POLAR_ACCESS_TOKEN?: string; POLAR_WEBHOOK_SECRET?: string; POLAR_PRO_MONTHLY_ID?: string; POLAR_PRO_ANNUAL_ID?: string; OPENROUTER_API_KEY?: string };
		}
	}
}

export {};
