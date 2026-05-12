import { desc, eq } from 'drizzle-orm';

import { getDb } from './db';
import { villas } from './schema';

export type VillaImage = {
  url: string;
  title: string;
  order: number;
};

export type VillaRecord = {
  id: number;
  hostId: number;
  name: string;
  slug: string;
  location: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewsCount: number;
  discount: number;
  isNew: boolean;
  status: 'pending_review' | 'approved' | 'rejected' | 'draft';
  images: VillaImage[];
  amenities: string[];
  access: string[];
  rules: string;
  specifications: Record<string, string>;
  stock: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type VillaInput = {
  hostId: number;
  name: string;
  location: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  rating?: number;
  reviewsCount?: number;
  discount?: number;
  isNew?: boolean;
  images?: VillaImage[];
  amenities?: string[];
  access?: string[];
  rules?: string;
  specifications?: Record<string, string>;
  stock?: number;
};

export const slugify = (input: string) => (
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
);

const normalizeImages = (value: unknown): VillaImage[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => ({
      url: typeof item === 'object' && item !== null && 'url' in item ? String((item as VillaImage).url || '') : '',
      title: typeof item === 'object' && item !== null && 'title' in item ? String((item as VillaImage).title || '') : '',
      order: typeof item === 'object' && item !== null && 'order' in item ? Number((item as VillaImage).order || index) : index,
    }))
    .filter((item) => Boolean(item.url))
    .sort((a, b) => a.order - b.order);
};

const normalizeStringArray = (value: unknown) => (Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : []);

export const toVillaRecord = (row: typeof villas.$inferSelect): VillaRecord => ({
  id: row.id,
  hostId: row.hostId,
  name: row.name,
  slug: row.slug,
  location: row.location,
  category: row.category,
  description: row.description,
  price: row.price,
  originalPrice: row.originalPrice ?? null,
  rating: Number(row.rating || 0),
  reviewsCount: row.reviewsCount,
  discount: row.discount,
  isNew: Boolean(row.isNew),
  status: row.status as VillaRecord['status'],
  images: normalizeImages(row.images),
  amenities: normalizeStringArray(row.amenities),
  access: normalizeStringArray(row.access),
  rules: row.rules,
  specifications: row.specifications || {},
  stock: row.stock,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
  publishedAt: row.publishedAt || null,
});

export const findVillaBySlug = async (slug: string) => {
  const db = await getDb();
  const row = await db.select().from(villas).where(eq(villas.slug, slug)).get();
  return row ? toVillaRecord(row) : null;
};

export const findVillaById = async (id: number) => {
  const db = await getDb();
  const row = await db.select().from(villas).where(eq(villas.id, id)).get();
  return row ? toVillaRecord(row) : null;
};

export const listVillas = async (filters?: { status?: string; hostId?: number; category?: string; search?: string }) => {
  const db = await getDb();
  const rows = await db.select().from(villas).orderBy(desc(villas.createdAt)).all();

  const filtered = rows.filter((row) => {
    const normalized = toVillaRecord(row);
    const matchesStatus = !filters?.status || normalized.status === filters.status;
    const matchesHost = !filters?.hostId || normalized.hostId === filters.hostId;
    const matchesCategory = !filters?.category || normalized.category === filters.category;
    const search = (filters?.search || '').trim().toLowerCase();
    const matchesSearch = !search || [normalized.name, normalized.location, normalized.description, normalized.category].some((value) => value.toLowerCase().includes(search));
    return matchesStatus && matchesHost && matchesCategory && matchesSearch;
  });

  return filtered.map(toVillaRecord);
};

export const getPublishedVillas = async (limit = 4) => {
  const villas = await listVillas({ status: 'approved' });

  return villas.slice(0, limit);
};