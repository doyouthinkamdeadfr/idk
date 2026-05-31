import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey().notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified').notNull().default(0),
	name: text('name').notNull(),
	image: text('image'),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: text('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent')
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id').notNull().references(() => user.id),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: text('access_token_expires_at'),
	refreshTokenExpiresAt: text('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey().notNull(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: text('expires_at').notNull(),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const schema = { user, session, account, verification };
