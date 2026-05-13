import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { users } from '@/lib/schema';

const normalizePhone = (value: string) => value.replace(/[^0-9]/g, '').trim();

export async function POST(request: Request) {
  const body = await request.json();
  const phone = normalizePhone(String(body.phone || ''));
  const firstName = String(body.firstName || '').trim();
  const lastName = String(body.lastName || '').trim();

  if (!phone || !firstName || !lastName) {
    return NextResponse.json({ success: false, message: 'نام، نام خانوادگی و شماره موبایل الزامی است.' }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date().toISOString();

  const existing = await db.select().from(users).where(eq(users.phone, phone)).get();
  if (existing) {
    await db.update(users).set({ firstName, lastName, updatedAt: now, lastLoginAt: now }).where(eq(users.id, existing.id));
    await persistDb();
    return NextResponse.json({
      success: true,
      data: { id: existing.id, firstName, lastName, phone },
    });
  }

  const [created] = await db.insert(users).values({
    firstName,
    lastName,
    phone,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  }).returning();

  await persistDb();

  return NextResponse.json({
    success: true,
    data: { id: created.id, firstName: created.firstName, lastName: created.lastName, phone: created.phone },
  });
}
