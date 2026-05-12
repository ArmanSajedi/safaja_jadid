import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { hosts } from '@/lib/schema';

const getIdFromUrl = (url: string) => {
  const pathname = new URL(url).pathname;
  const m = pathname.match(/\/api\/hosts\/(\d+)(?:\/|$)/);
  return m ? m[1] : '';
};

export async function GET(request: Request) {
  const db = await getDb();
  const id = getIdFromUrl(request.url);

  const row = await db.select().from(hosts).where(eq(hosts.id, Number(id))).get();

  if (!row) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: row });
}

export async function PATCH(request: Request) {
  const db = await getDb();
  const id = getIdFromUrl(request.url);
  const body = (await request.json()) as {
    status?: string;
    documentsStatus?: string;
    nationalIdImage?: string | null;
    ownershipDocImage?: string | null;
  };

  const existing = await db.select().from(hosts).where(eq(hosts.id, Number(id))).get();
  if (!existing) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  const updates: Record<string, string | null> & { updatedAt?: string } = {};

  if (body.status) updates.status = body.status;
  if (body.documentsStatus) updates.documentsStatus = body.documentsStatus;
  if (body.nationalIdImage || body.nationalIdImage === null) updates.nationalIdImage = body.nationalIdImage;
  if (body.ownershipDocImage || body.ownershipDocImage === null) updates.ownershipDocImage = body.ownershipDocImage;

  // If admin approves initial application, allow document stage by setting documentsStatus to 'pending' when not previously set
  if (body.status === 'approved' && (!existing.documentsStatus || existing.documentsStatus === 'not_submitted')) {
    updates.documentsStatus = updates.documentsStatus || 'pending';
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, message: 'No updates provided.' }, { status: 400 });
  }

  updates.updatedAt = new Date().toISOString();

  const [updated] = await db.update(hosts).set(updates).where(eq(hosts.id, Number(id))).returning();

  if (!updated) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  await persistDb();

  return NextResponse.json({ success: true, data: updated, previous: existing, appliedUpdates: updates });
}
