import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { hosts } from '@/lib/schema';

export async function GET(request: Request) {
  const db = await getDb();
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  const status = searchParams.get('status');

  const q = db.select().from(hosts);

  if (phone) q.where(eq(hosts.phone, phone));
  if (status) q.where(eq(hosts.status, status));

  const rows = await q.all();

  return NextResponse.json({ success: true, data: rows });
}

export async function POST(request: Request) {
  const db = await getDb();
  const body = await request.json();
  const { firstName, lastName, phone, nationalId, address, city, province } = body;

  if (!firstName || !lastName || !phone) {
    return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
  }

  const now = new Date().toISOString();

  const [created] = await db.insert(hosts).values({
    firstName,
    lastName,
    phone,
    nationalId: nationalId || null,
    address: address || null,
    city: city || null,
    province: province || null,
    status: 'pending',
    documentsStatus: 'not_submitted',
    nationalIdImage: null,
    ownershipDocImage: null,
    createdAt: now,
    updatedAt: now,
  }).returning();

  await persistDb();

  return NextResponse.json({ success: true, data: created });
}
