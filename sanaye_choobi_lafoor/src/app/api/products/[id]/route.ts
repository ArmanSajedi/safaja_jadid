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

const getIdFromUrl = (url: string) => {
  const pathname = new URL(url).pathname;
  const match = pathname.match(/\/api\/products\/(\d+)(?:\/|$)/);
  return match ? match[1] : '';
};

export async function GET(request: Request) {
  const id = getIdFromUrl(request.url);
  const villa = await dbGetById(Number(id));
  if (!villa) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: toProductResponse(villa) });
}

async function dbGetById(id: number) {
  const db = await getDb();
  const row = await db.select().from(villas).where(eq(villas.id, id)).get();
  return row ? toVillaRecord(row) : null;
}

export async function PATCH(request: Request) {
  const db = await getDb();
  const id = getIdFromUrl(request.url);
  const body = await request.json();

  const existingRow = await db.select().from(villas).where(eq(villas.id, Number(id))).get();
  if (!existingRow) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};

  if (body.hostId !== undefined) updates.hostId = Number(body.hostId);
  if (body.name !== undefined) updates.name = body.name;
  if (body.location !== undefined) updates.location = body.location;
  if (body.category !== undefined) updates.category = body.category;
  if (body.description !== undefined) updates.description = body.description;
  if (body.price !== undefined) updates.price = Number(body.price);
  if (body.originalPrice !== undefined) updates.originalPrice = body.originalPrice === null || body.originalPrice === '' ? null : Number(body.originalPrice);
  if (body.rating !== undefined) updates.rating = Number(body.rating);
  if (body.reviewsCount !== undefined) updates.reviewsCount = Number(body.reviewsCount);
  if (body.discount !== undefined) updates.discount = Number(body.discount);
  if (body.isNew !== undefined) updates.isNew = Boolean(body.isNew);
  if (body.images !== undefined) updates.images = body.images;
  if (body.amenities !== undefined) updates.amenities = body.amenities;
  if (body.access !== undefined) updates.access = body.access;
  if (body.rules !== undefined) updates.rules = body.rules;
  if (body.specifications !== undefined) updates.specifications = body.specifications;
  if (body.stock !== undefined) updates.stock = Number(body.stock);
  if (body.status !== undefined) updates.status = body.status;

  if (body.name && body.name !== existingRow.name) {
    const baseSlug = slugify(String(body.name));
    let resolvedSlug = baseSlug;
    let counter = 1;

    while (true) {
      const existingSlug = await db.select({ id: villas.id }).from(villas).where(eq(villas.slug, resolvedSlug)).get();
      if (!existingSlug || existingSlug.id === existingRow.id) break;
      resolvedSlug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    updates.slug = resolvedSlug;
  }

  if (body.status === 'approved') {
    updates.publishedAt = existingRow.publishedAt || new Date().toISOString();
  }

  updates.updatedAt = new Date().toISOString();

  const [updated] = await db.update(villas).set(updates).where(eq(villas.id, Number(id))).returning();
  await persistDb();

  return NextResponse.json({ success: true, data: toProductResponse(toVillaRecord(updated)) });
}

export async function DELETE(request: Request) {
  const db = await getDb();
  const id = getIdFromUrl(request.url);

  const existing = await db.select().from(villas).where(eq(villas.id, Number(id))).get();
  if (!existing) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  await db.delete(villas).where(eq(villas.id, Number(id)));
  await persistDb();

  return NextResponse.json({ success: true });
}
