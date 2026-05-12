import { desc, eq } from 'drizzle-orm';

import { getDb } from './db';
import { posts } from './schema';

export type MagazinePost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  publishedAt: string | null;
  tags: string[];
  imageUrl: string | null;
};

export const getPublishedPosts = async (limit = 4): Promise<MagazinePost[]> => {
  const db = await getDb();
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .all();

  return rows.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    createdAt: post.createdAt,
    publishedAt: post.publishedAt || null,
    tags: Array.isArray(post.tags) ? post.tags : [],
    imageUrl: post.imageUrl || null,
  }));
};