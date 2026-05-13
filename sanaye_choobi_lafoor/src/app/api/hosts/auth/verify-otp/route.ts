import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { hostOtpCodes, hosts } from '@/lib/schema';

const normalizePhone = (value: string) => value.replace(/[^0-9]/g, '').trim();

export async function POST(request: Request) {
  const body = await request.json();
  const phone = normalizePhone(String(body.phone || ''));
  const code = String(body.code || '').trim();

  if (!phone || !code) {
    return NextResponse.json({ success: false, message: 'شماره موبایل و کد الزامی است.' }, { status: 400 });
  }

  const db = await getDb();
  const host = await db.select().from(hosts).where(eq(hosts.phone, phone)).get();

  if (!host) {
    return NextResponse.json({ success: false, message: 'میزبانی با این شماره یافت نشد.' }, { status: 404 });
  }

  const otpList = await db
    .select()
    .from(hostOtpCodes)
    .where(eq(hostOtpCodes.phone, phone))
    .orderBy(desc(hostOtpCodes.createdAt))
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
  await db.update(hostOtpCodes).set({ usedAt: now }).where(eq(hostOtpCodes.id, latest.id));
  await persistDb();

  return NextResponse.json({
    success: true,
    data: {
      id: host.id,
      firstName: host.firstName,
      lastName: host.lastName,
      phone: host.phone,
      status: host.status,
      documentsStatus: host.documentsStatus,
    },
  });
}
