import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { hosts, villas } from '@/lib/schema';
import { slugify, toVillaRecord } from '@/lib/villas';

const toProductResponse = (villa: ReturnType<typeof toVillaRecord>) => ({
  id: villa.id,
  name: villa.name,
  slug: villa.slug,
  description: villa.description,
  price: villa.price,
  originalPrice: villa.originalPrice ?? undefined,
  category: villa.category,
  location: villa.location,
  images: villa.images.map((image) => image.url),
  imageDetails: villa.images,
  amenities: villa.amenities,
  access: villa.access,
  rules: villa.rules,
  rating: villa.rating,
  reviewsCount: villa.reviewsCount,
  discount: villa.discount,
  isNew: villa.isNew,
  isActive: villa.status === 'approved',
  status: villa.status,
  hostId: villa.hostId,
  stock: villa.stock,
  specifications: villa.specifications,
  createdAt: villa.createdAt,
  updatedAt: villa.updatedAt,
  publishedAt: villa.publishedAt,
});

export async function GET(request: Request) {
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const status = searchParams.get('status') || 'approved';
  const hostId = searchParams.get('hostId');

  const rows = await db.select().from(villas).orderBy(villas.createdAt).all();
  const filtered = rows
    .map(toVillaRecord)
    .filter((villa) => {
      const matchesStatus = status === 'all' || villa.status === status;
      const matchesCategory = !category || villa.category === category;
      const matchesHost = !hostId || villa.hostId === Number(hostId);
      const query = (search || '').trim().toLowerCase();
      const matchesSearch = !query || [villa.name, villa.description, villa.location, villa.category].some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesCategory && matchesHost && matchesSearch;
    })
    .sort((a, b) => b.id - a.id)
    .map(toProductResponse);

  return NextResponse.json({ success: true, data: filtered, total: filtered.length });
}

export async function POST(request: Request) {
  const db = await getDb();
  const body = await request.json();

  const {
    hostId,
    name,
    location,
    category,
    description,
    price,
    originalPrice,
    rating = 0,
    reviewsCount = 0,
    discount = 0,
    isNew = false,
    images = [],
    amenities = [],
    access = [],
    rules = '',
    specifications = {},
    stock = 1,
  } = body;

  if (!hostId || !name || !location || !category || !description || !price) {
    return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
  }

  const host = await db.select().from(hosts).where(eq(hosts.id, Number(hostId))).get();
  if (!host) {
    return NextResponse.json({ success: false, message: 'Host not found.' }, { status: 404 });
  }

  if (host.status !== 'approved' || host.documentsStatus !== 'approved') {
    return NextResponse.json({ success: false, message: 'Host must be approved and documents must be verified before creating a villa.' }, { status: 403 });
  }

  const now = new Date().toISOString();
  const baseSlug = slugify(name);
  let resolvedSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.select({ id: villas.id }).from(villas).where(eq(villas.slug, resolvedSlug)).get();
    if (!existing) break;
    resolvedSlug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const [created] = await db.insert(villas).values({
    hostId: Number(hostId),
    name,
    slug: resolvedSlug,
    location,
    category,
    description,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    rating: Number(rating),
    reviewsCount: Number(reviewsCount),
    discount: Number(discount),
    isNew: Boolean(isNew),
    status: 'pending_review',
    images,
    amenities,
    access,
    rules,
    specifications,
    stock: Number(stock) || 1,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  }).returning();

  await persistDb();

  return NextResponse.json({ success: true, data: toProductResponse(toVillaRecord(created)), message: 'Villa created and waiting for admin approval.' });
}