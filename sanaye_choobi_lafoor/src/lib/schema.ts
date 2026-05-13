import { integer, real, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default([]),
  author: text('author').notNull(),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const hosts = sqliteTable('hosts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone').notNull(),
  nationalId: text('national_id'),
  address: text('address'),
  city: text('city'),
  province: text('province'),
  status: text('status').notNull().default('pending'),
  documentsStatus: text('documents_status').notNull().default('not_submitted'),
  nationalIdImage: text('national_id_image'),
  ownershipDocImage: text('ownership_doc_image'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const villas = sqliteTable('villas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hostId: integer('host_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  location: text('location').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  rating: real('rating').notNull().default(0),
  reviewsCount: integer('reviews_count').notNull().default(0),
  discount: integer('discount').notNull().default(0),
  isNew: integer('is_new', { mode: 'boolean' }).notNull().default(false),
  status: text('status').notNull().default('pending_review'),
  images: text('images', { mode: 'json' }).$type<Array<{ url: string; title: string; order: number }>>().notNull().default([]),
  amenities: text('amenities', { mode: 'json' }).$type<string[]>().notNull().default([]),
  access: text('access', { mode: 'json' }).$type<string[]>().notNull().default([]),
  rules: text('rules').notNull().default(''),
  specifications: text('specifications', { mode: 'json' }).$type<Record<string, string>>().notNull().default({}),
  stock: integer('stock').notNull().default(1),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  publishedAt: text('published_at'),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone').notNull().unique(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  lastLoginAt: text('last_login_at'),
});

export const otpCodes = sqliteTable('otp_codes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  usedAt: text('used_at'),
});

export const hostOtpCodes = sqliteTable('host_otp_codes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  hostId: integer('host_id').notNull(),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at').notNull(),
  usedAt: text('used_at'),
});

export const reviews = sqliteTable('reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  villaId: integer('villa_id').notNull(),
  userName: text('user_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  status: text('status').notNull().default('approved'),
  createdAt: text('created_at').notNull(),
});
