import { NextResponse } from 'next/server';
import Kavenegar from 'kavenegar';
import { eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { hostOtpCodes, hosts } from '@/lib/schema';

const normalizePhone = (value: string) => value.replace(/[^0-9]/g, '').trim();

const sendOtpSms = async (phone: string, code: string) => {
  const apiKey = process.env.KAVENEGAR_API_KEY;
  if (!apiKey) {
    throw new Error('Kavenegar API key is not configured');
  }

  const sender = process.env.KAVENEGAR_SENDER || '2000200348';
  const api = Kavenegar.KavenegarApi({ apikey: apiKey });

  await new Promise<void>((resolve, reject) => {
    api.Send({
      receptor: phone,
      sender,
      message: `کد تایید میزبان سفرجا: ${code}`,
    }, (_response: unknown, status: number) => {
      if (status >= 200 && status < 300) {
        resolve();
      } else {
        reject(new Error(`Kavenegar error: ${status}`));
      }
    });
  });
};

export async function POST(request: Request) {
  const body = await request.json();
  const phone = normalizePhone(String(body.phone || ''));

  if (!phone) {
    return NextResponse.json({ success: false, message: 'شماره موبایل معتبر نیست.' }, { status: 400 });
  }

  const db = await getDb();
  const host = await db.select().from(hosts).where(eq(hosts.phone, phone)).get();

  if (!host) {
    return NextResponse.json({ success: false, message: 'میزبانی با این شماره یافت نشد.' }, { status: 404 });
  }

  if (host.status !== 'approved') {
    return NextResponse.json({ success: false, message: 'درخواست شما هنوز تایید نشده است.' }, { status: 403 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

  await db.insert(hostOtpCodes).values({
    hostId: host.id,
    phone,
    code,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    usedAt: null,
  });

  await persistDb();
  await sendOtpSms(phone, code);

  return NextResponse.json({ success: true, hostId: host.id });
}
