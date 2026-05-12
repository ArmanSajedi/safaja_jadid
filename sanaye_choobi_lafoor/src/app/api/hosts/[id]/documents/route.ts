import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { eq } from 'drizzle-orm';

import { getDb, persistDb } from '@/lib/db';
import { hosts } from '@/lib/schema';

const sanitizeFileName = (name: string) => {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'upload';
};

const getIdFromUrl = (url: string) => {
  const pathname = new URL(url).pathname;
  const m = pathname.match(/\/api\/hosts\/(\d+)(?:\/documents(?:\/|$)|(?:\/|$))/);
  return m ? m[1] : '';
};

export async function POST(request: Request) {
  const db = await getDb();
  const id = getIdFromUrl(request.url);

  const formData = await request.formData();
  const nationalFile = formData.get('nationalId');
  const ownershipFile = formData.get('ownershipDoc');

  if ((!nationalFile || !(nationalFile instanceof Blob)) && (!ownershipFile || !(ownershipFile instanceof Blob))) {
    return NextResponse.json({ success: false, message: 'At least one file is required.' }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const now = new Date().toISOString();
  const updates: Record<string, string> & { documentsStatus?: string; updatedAt?: string } = {};

  // verify host exists and is approved for document submission
  const existing = await db.select().from(hosts).where(eq(hosts.id, Number(id))).get();
  if (!existing) {
    return NextResponse.json({ success: false, message: 'Host not found.' }, { status: 404 });
  }

  if (existing.status !== 'approved') {
    return NextResponse.json({ success: false, message: 'Initial application must be approved before submitting documents.' }, { status: 403 });
  }

  if (nationalFile && nationalFile instanceof Blob) {
    const fileNameBase = sanitizeFileName((nationalFile as File).name || 'national');
    const ext = path.extname(fileNameBase) || '.png';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-nid${ext}`;
    const buffer = Buffer.from(await nationalFile.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);
    updates.nationalIdImage = `/uploads/${uniqueName}`;
  }

  if (ownershipFile && ownershipFile instanceof Blob) {
    const fileNameBase = sanitizeFileName((ownershipFile as File).name || 'ownership');
    const ext = path.extname(fileNameBase) || '.png';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}-own${ext}`;
    const buffer = Buffer.from(await ownershipFile.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);
    updates.ownershipDocImage = `/uploads/${uniqueName}`;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, message: 'No files saved.' }, { status: 400 });
  }

  updates.documentsStatus = 'pending';
  updates.updatedAt = now;

  const [updated] = await db.update(hosts).set(updates).where(eq(hosts.id, Number(id))).returning();

  if (!updated) {
    return NextResponse.json({ success: false, message: 'Host not found.' }, { status: 404 });
  }

  await persistDb();

  return NextResponse.json({ success: true, data: updated });
}
