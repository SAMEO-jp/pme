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
    // 梱包リスト取得
    const konpoList = await db.all('SELECT ROWID, KONPO_LIST_ID, WIGHT FROM KONPO_LIST');
    return NextResponse.json(konpoList || []);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '梱包リストの取得に失敗しました' }, { status: 500 });
  }
}
