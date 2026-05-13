import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { otpCodes, users } from '@/lib/schema';

const normalizePhone = (value: string) => value.replace(/[^0-9]/g, '').trim();

export async function POST(request: Request) {
  const body = await request.json();
  const phone = normalizePhone(String(body.phone || ''));
  const code = String(body.code || '').trim();

  if (!phone || !code) {
    return NextResponse.json({ success: false, message: 'شماره موبایل و کد الزامی است.' }, { status: 400 });
  }

  const db = await getDb();
  const otpList = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.phone, phone))
    .orderBy(desc(otpCodes.createdAt))
    .all();

  const latest = otpList.find((item) => !item.usedAt);
  if (!latest) {
    return NextResponse.json({ success: false, message: 'کد معتبر نیست.' }, { status: 400 });
  }

  if (latest.code !== code) {
    return NextResponse.json({ success: false, message: 'کد وارد شده صحیح نیست.' }, { status: 400 });
  }

  const expiresAt = new Date(latest.expiresAt);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
    return NextResponse.json({ success: false, message: 'کد منقضی شده است.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  await db
    .update(otpCodes)
    .set({ usedAt: now })
    .where(eq(otpCodes.id, latest.id));

  let user = await db.select().from(users).where(eq(users.phone, phone)).get();

  if (!user) {
    await persistDb();
    return NextResponse.json({
      success: true,
      requiresProfile: true,
      data: { phone },
    });
  }

  await db.update(users).set({ lastLoginAt: now, updatedAt: now }).where(eq(users.id, user.id));
  await persistDb();

  return NextResponse.json({
    success: true,
    requiresProfile: false,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
  });
}
