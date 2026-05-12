import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { posts } from '@/lib/schema';

const slugify = (input: string) => (
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
);

export async function GET(request: Request) {
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const publishedParam = searchParams.get('published');
  const published = publishedParam === 'true' ? true : publishedParam === 'false' ? false : undefined;

  const rows = published === undefined
    ? await db.select().from(posts).orderBy(desc(posts.createdAt)).all()
    : await db.select().from(posts).where(eq(posts.published, published)).orderBy(desc(posts.createdAt)).all();

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(request: Request) {
  const db = await getDb();
  const body = await request.json();
  const {
    title,
    slug,
    excerpt,
    content,
    imageUrl,
    tags,
    author,
    published,
  } = body;

  if (!title || !excerpt || !content || !author) {
    return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
  }

  const normalizedTags = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : [];

  const baseSlug = slug && typeof slug === 'string' && slug.trim() ? slugify(slug) : slugify(title);
  let resolvedSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, resolvedSlug)).get();
    if (!existing) break;
    resolvedSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const now = new Date().toISOString();

  const [created] = await db.insert(posts).values({
    title,
    slug: resolvedSlug,
    excerpt,
    content,
    imageUrl: imageUrl || null,
    tags: normalizedTags,
    author,
    published: Boolean(published),
    publishedAt: published ? now : null,
    createdAt: now,
    updatedAt: now,
  }).returning();

  await persistDb();

  return NextResponse.json({ success: true, data: created });
}
