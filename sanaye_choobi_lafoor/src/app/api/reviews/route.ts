import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { reviews, villas } from '@/lib/schema';

const toNumber = (value: unknown) => Number(value);

export async function GET(request: Request) {
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const villaId = toNumber(searchParams.get('villaId'));

  if (!villaId || Number.isNaN(villaId)) {
    return NextResponse.json({ success: false, message: 'شناسه ویلا نامعتبر است.' }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.villaId, villaId), eq(reviews.status, 'approved')))
    .orderBy(desc(reviews.createdAt))
    .all();

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(request: Request) {
  const db = await getDb();
  const body = await request.json();

  const villaId = toNumber(body.villaId);
  const userName = String(body.userName || '').trim();
  const comment = String(body.comment || '').trim();
  const rating = toNumber(body.rating);

  if (!villaId || Number.isNaN(villaId)) {
    return NextResponse.json({ success: false, message: 'شناسه ویلا نامعتبر است.' }, { status: 400 });
  }

  if (!userName || !comment || !rating) {
    return NextResponse.json({ success: false, message: 'نام، امتیاز و متن نظر الزامی است.' }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ success: false, message: 'امتیاز باید بین 1 تا 5 باشد.' }, { status: 400 });
  }

  const villa = await db.select().from(villas).where(eq(villas.id, villaId)).get();
  if (!villa) {
    return NextResponse.json({ success: false, message: 'ویلا یافت نشد.' }, { status: 404 });
  }

  const now = new Date().toISOString();
  const [created] = await db.insert(reviews).values({
    villaId,
    userName,
    rating,
    comment,
    status: 'approved',
    createdAt: now,
  }).returning();

  const existingReviews = await db
    .select({ rating: reviews.rating })
    .from(reviews)
    .where(and(eq(reviews.villaId, villaId), eq(reviews.status, 'approved')))
    .all();

  const total = existingReviews.reduce((sum, item) => sum + Number(item.rating || 0), 0);
  const reviewsCount = existingReviews.length;
  const averageRating = reviewsCount ? Number((total / reviewsCount).toFixed(1)) : 0;

  await db.update(villas).set({
    rating: averageRating,
    reviewsCount,
    updatedAt: now,
  }).where(eq(villas.id, villaId));

  await persistDb();

  return NextResponse.json({
    success: true,
    data: created,
    meta: {
      averageRating,
      reviewsCount,
    },
  });
}
