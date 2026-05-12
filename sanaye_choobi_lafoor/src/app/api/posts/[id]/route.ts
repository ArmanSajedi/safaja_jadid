import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

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

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
  }

  const post = await db.select().from(posts).where(eq(posts.id, id)).get();

  if (!post) {
    return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: post });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
  }

  const existingPost = await db.select().from(posts).where(eq(posts.id, id)).get();
  if (!existingPost) {
    return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
  }

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
    if (!existing || existing.id === id) break;
    resolvedSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const now = new Date().toISOString();
  const publishedValue = Boolean(published);

  const [updated] = await db.update(posts).set({
    title,
    slug: resolvedSlug,
    excerpt,
    content,
    imageUrl: imageUrl || null,
    tags: normalizedTags,
    author,
    published: publishedValue,
    publishedAt: publishedValue ? existingPost.publishedAt || now : null,
    updatedAt: now,
  }).where(eq(posts.id, id)).returning();

  await persistDb();

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = await getDb();
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ success: false, message: 'Invalid id.' }, { status: 400 });
  }

  const existingPost = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, id)).get();
  if (!existingPost) {
    return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
  }

  await db.delete(posts).where(eq(posts.id, id));
  await persistDb();

  return NextResponse.json({ success: true });
}
