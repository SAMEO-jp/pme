import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST: 梱包単位の重量を更新
export async function POST(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    // 部品の重量を計算して更新
    const parts = await db.all(`
      SELECT 
        bp.PART_ID,
        bp.PART_NAME,
        COALESCE(SUM(CAST(bb.BUZAI_WEIGHT AS FLOAT)), 0) as TOTAL_WEIGHT
      FROM BOM_PART bp
      LEFT JOIN BOM_BUZAI bb ON bp.PART_ID = bb.PART_ID
      WHERE bp.PART_PROJECT_ID = ?
      GROUP BY bp.PART_ID, bp.PART_NAME
    `, [params.projectNumber]);

    // 各部品の重量を更新
    for (const part of parts) {
      await db.run(
        `UPDATE BOM_PART 
         SET PART_TANNI_WEIGHT = ?
         WHERE PART_ID = ? AND PART_PROJECT_ID = ?`,
        [part.TOTAL_WEIGHT, part.PART_ID, params.projectNumber]
      );

      // 梱包単位の重量も更新
      await db.run(
        `UPDATE KONPO_TANNI 
         SET BUZAI_WEIGHT = CAST(PART_KO AS FLOAT) * CAST(ZENSU_KO AS FLOAT) * ?
         WHERE PART_ID = ?`,
        [part.TOTAL_WEIGHT, part.PART_ID]
      );
    }

    return NextResponse.json({
      message: '部品の重量を更新しました',
      updatedCount: parts.length
    });
  } catch (error) {
    console.error('Error updating part weights:', error);
    return NextResponse.json(
      { error: '部品の重量更新に失敗しました' },
      { status: 500 }
    );
  }
} 