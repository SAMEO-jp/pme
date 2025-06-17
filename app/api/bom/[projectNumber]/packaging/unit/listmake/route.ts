import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

export async function POST(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const { projectNumber } = params;
    const body = await request.json();
    const { units } = body;

    if (!units || !Array.isArray(units) || units.length === 0) {
      return NextResponse.json(
        { error: '選択された項目がありません' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // 新しいKONPO_LIST_IDを生成
    const result = await db.get(`
      SELECT MAX(CAST(SUBSTR(KONPO_LIST_ID, 2) AS INTEGER)) as maxId
      FROM KONPO_LIST
      WHERE KONPO_LIST_ID LIKE 'K%'
    `);

    const nextId = (result?.maxId || 0) + 1;
    const newKonpoId = `K${nextId.toString().padStart(6, '0')}`;

    // トランザクション開始
    await db.run('BEGIN TRANSACTION');

    try {
      // KONPO_LISTに新しいIDを登録
      await db.run(`
        INSERT INTO KONPO_LIST (KONPO_LIST_ID, PROJECT_ID)
        VALUES (?, ?)
      `, [newKonpoId, projectNumber]);

      // 選択された梱包単位のKONPO_LIST_IDを更新
      const selectedUnitIds = Array.from(units);
      const placeholders = selectedUnitIds.map(() => '?').join(',');
      await db.run(`
        UPDATE KONPO_TANNI
        SET KONPO_LIST_ID = ?
        WHERE KONPO_TANNI_ID IN (${placeholders})
      `, [newKonpoId, ...selectedUnitIds]);

      // トランザクションをコミット
      await db.run('COMMIT');

      return NextResponse.json({
        success: true,
        konpoId: newKonpoId,
        updatedCount: selectedUnitIds.length
      });
    } catch (error) {
      // エラーが発生した場合はロールバック
      await db.run('ROLLBACK');
      throw error;
    } finally {
      await db.close();
    }
  } catch (error) {
    console.error('リスト作成エラー:', error);
    return NextResponse.json(
      { error: 'リストの作成に失敗しました' },
      { status: 500 }
    );
  }
}
