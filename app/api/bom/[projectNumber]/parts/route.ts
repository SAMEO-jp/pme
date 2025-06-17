import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// データベース接続を取得
async function getDb() {
  return open({
    filename: path.join(process.cwd(), 'data', 'achievements.db'),
    driver: sqlite3.Database
  });
}

// 部品リストの取得
export async function GET(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const db = await getDb();
    
    // プロジェクトの存在確認
    const project = await db.get('SELECT * FROM project WHERE project_number = ?', params.projectNumber);
    if (!project) {
      return NextResponse.json({ error: 'プロジェクトが見つかりません' }, { status: 404 });
    }

    // BOM_PARTから部品リストを取得
    const parts = await db.all(`
      SELECT DISTINCT 
        PART_ID,
        PART_NAME,
        MANUFACTURER,
        project_ID,
        ZUMEN_ID
      FROM BOM_PART
      WHERE project_ID = ?
      ORDER BY PART_NAME ASC
    `, params.projectNumber);

    // 結果を整形
    const formattedParts = parts.map(part => ({
      part_ID: part.PART_ID,
      part_name: part.PART_NAME || '未設定',
      manufacturer: part.MANUFACTURER || '未設定',
      project_ID: part.project_ID,
      ZUMEN_ID: part.ZUMEN_ID
    }));

    return NextResponse.json(formattedParts || []); // 結果がnullの場合は空配列を返す
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '部品リストの取得に失敗しました' }, { status: 500 });
  }
} 