import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const sanitizeFileName = (name: string) => {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'upload';
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ success: false, message: 'File is required.' }, { status: 400 });
  }

  const fileNameBase = sanitizeFileName((file as File).name || 'upload');
  const extension = path.extname(fileNameBase) || '.png';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${fileNameBase.replace(extension, '')}${extension}`;

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadDir, uniqueName);

  await writeFile(filePath, buffer);

  return NextResponse.json({ success: true, url: `/uploads/${uniqueName}` });
}
