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

export async function GET(request: Request, { params }: { params: { projectNumber: string, KONPO_LIST: string } }) {
  try {
    const db = await getDb();
    // 梱包データ取得
    const konpo = await db.get('SELECT WIGHT FROM KONPO_LIST WHERE ROWID = ?', params.KONPO_LIST);
    if (!konpo) {
      return NextResponse.json({ error: '梱包データが見つかりません' }, { status: 404 });
    }
    return NextResponse.json({ wight: konpo.WIGHT });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '梱包重量の取得に失敗しました' }, { status: 500 });
  }
}
