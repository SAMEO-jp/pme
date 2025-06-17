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
    // 部品一覧取得
    const parts = await db.all('SELECT PART_ID, PART_NAME FROM BOM_PART WHERE project_ID = ?', params.projectNumber);
    // 各部品の梱包割当状況取得
    const tanni = await db.all('SELECT PART_KO, KONPO_ID FROM KONPO_TANNI');
    // 部品IDごとに割当状況を付与
    const result = parts.map(part => {
      const assigned = tanni.find(t => t.PART_KO === part.PART_ID);
      return {
        part_id: part.PART_ID,
        part_name: part.PART_NAME,
        konpo_id: assigned ? assigned.KONPO_ID : null
      };
    });
    return NextResponse.json(result || []);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '部品割当状況の取得に失敗しました' }, { status: 500 });
  }
} 