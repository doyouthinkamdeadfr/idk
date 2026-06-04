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

export const subscription = sqliteTable('subscription', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id').notNull().references(() => user.id),
	polarSubscriptionId: text('polar_subscription_id').notNull().unique(),
	polarProductId: text('polar_product_id').notNull(),
	status: text('status').notNull(),
	currentPeriodStart: text('current_period_start'),
	currentPeriodEnd: text('current_period_end'),
	cancelAtPeriodEnd: integer('cancel_at_period_end').notNull().default(0),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const chat = sqliteTable('chat', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id').notNull().references(() => user.id),
	title: text('title').notNull().default('New Chat'),
	pinned: integer('pinned').notNull().default(0),
	archived: integer('archived').notNull().default(0),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const message = sqliteTable('message', {
	id: text('id').primaryKey().notNull(),
	chatId: text('chat_id').notNull().references(() => chat.id),
	userId: text('user_id').notNull().references(() => user.id),
	role: text('role', { enum: ['user', 'assistant'] }).notNull(),
	content: text('content').notNull(),
	attachments: text('attachments'),
	sources: text('sources'),
	createdAt: text('created_at').notNull()
});

export const document = sqliteTable('document', {
	id: text('id').primaryKey().notNull(),
	userId: text('user_id').notNull().references(() => user.id),
	name: text('name').notNull(),
	type: text('type', { enum: ['file', 'image', 'link'] }).notNull(),
	mime: text('mime'),
	size: integer('size'),
	content: text('content'),
	status: text('status', { enum: ['processing', 'ready', 'error'] }).notNull().default('processing'),
	error: text('error'),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull()
});

export const documentChunk = sqliteTable('document_chunk', {
	id: text('id').primaryKey().notNull(),
	documentId: text('document_id').notNull().references(() => document.id),
	content: text('content').notNull(),
	embedding: text('embedding'),
	chunkIndex: integer('chunk_index').notNull()
});

export const chatDocument = sqliteTable('chat_document', {
	chatId: text('chat_id').notNull().references(() => chat.id),
	documentId: text('document_id').notNull().references(() => document.id)
});

export const schema = { user, session, account, verification, subscription, chat, message, document, documentChunk, chatDocument };
