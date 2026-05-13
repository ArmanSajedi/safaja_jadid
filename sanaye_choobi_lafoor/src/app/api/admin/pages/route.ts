import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'pages.json');

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to read pages data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Failed to write pages data' }, { status: 500 });
  }
}
