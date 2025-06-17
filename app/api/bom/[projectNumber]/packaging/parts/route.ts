import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

async function getDb() {
  return open({
    filename: path.join(process.cwd(), 'data', 'achievements.db'),
    driver: sqlite3.Database
  });
}

export async function GET(request: Request, { params }: { params: { projectNumber: string } }) {
  try {
    const db = await getDb();
    // BOM_PARTごとの重量リスト取得
    const parts = await db.all('SELECT PART_ID, PART_NAME, QUANTITY, ZUMEN_ID FROM BOM_PART WHERE PART_PROJECT_ID = ?', params.projectNumber);
    return NextResponse.json(parts || []);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '部品重量リストの取得に失敗しました' }, { status: 500 });
  }
}
