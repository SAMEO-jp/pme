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

export async function GET(request: Request, { params }: { params: { projectNumber: string, KONPO_LIST: string, KONPO_TANNI: string } }) {
  try {
    const db = await getDb();
    // 梱包単位データ取得
    const tanni = await db.get('SELECT ZENSU_KO FROM KONPO_TANNI WHERE ROWID = ?', params.KONPO_TANNI);
    if (!tanni) {
      return NextResponse.json({ error: '梱包単位データが見つかりません' }, { status: 404 });
    }
    return NextResponse.json({ zensu_ko: tanni.ZENSU_KO });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '梱包単位重量の取得に失敗しました' }, { status: 500 });
  }
}
