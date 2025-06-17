import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

export async function POST(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'achievements.db');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // KONPO_TANNIテーブルから未登録の梱包単位を取得
    const unregisteredUnits = await db.all(`
      SELECT kt.*, bp.PART_TANNI_WEIGHT
      FROM KONPO_TANNI kt
      LEFT JOIN BOM_PART bp ON kt.PART_ID = bp.PART_ID
      WHERE kt.KONPO_LIST_ID IS NULL OR kt.KONPO_LIST_ID = ''
    `);

    let syncedCount = 0;
    let updatedWeightCount = 0;

    // 未登録の梱包単位を処理
    for (const unit of unregisteredUnits) {
      // 梱包単位の重量を計算
      const totalWeight = unit.PART_KO * unit.ZENSU_KO * unit.PART_TANNI_WEIGHT;

      // KONPO_TANNIテーブルを更新
      await db.run(`
        UPDATE KONPO_TANNI
        SET BUZAI_WEIGHT = ?,
            BUZAI_QUANTITY = ?
        WHERE KONPO_TANNI_ID = ?
      `, [totalWeight, unit.PART_KO * unit.ZENSU_KO, unit.KONPO_TANNI_ID]);

      syncedCount++;
      updatedWeightCount++;
    }

    await db.close();

    return NextResponse.json({
      message: '梱包単位情報の同期が完了しました',
      syncedCount,
      updatedWeightCount
    });
  } catch (error) {
    console.error('Error syncing packaging units:', error);
    return NextResponse.json(
      { error: '梱包単位情報の同期に失敗しました' },
      { status: 500 }
    );
  }
} 