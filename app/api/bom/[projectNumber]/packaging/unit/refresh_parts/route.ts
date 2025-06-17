import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST: KONPO_TANNIリスト全件の部品情報をBOM_PARTから再取得・再更新
export async function POST(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    // KONPO_TANNIリスト取得
    const konpoUnits = await db.all(
      `SELECT KONPO_TANNI_ID, PART_ID FROM KONPO_TANNI`
    );
    let updatedCount = 0;
    for (const unit of konpoUnits) {
      // BOM_PARTから部品情報取得
      const part = await db.get(
        `SELECT PART_NAME, MANUFACTURER, PART_TANNI_WEIGHT FROM BOM_PART WHERE PART_ID = ? AND PART_PROJECT_ID = ?`,
        [unit.PART_ID, params.projectNumber]
      );
      if (part) {
        await db.run(
          `UPDATE KONPO_TANNI SET PART_NAME = ?, MANUFACTURER = ?, PART_TANNI_WEIGHT = ? WHERE KONPO_TANNI_ID = ?`,
          [part.PART_NAME, part.MANUFACTURER, part.PART_TANNI_WEIGHT, unit.KONPO_TANNI_ID]
        );
        updatedCount++;
      }
    }
    return NextResponse.json({ message: '部品情報を再更新しました', updatedCount });
  } catch (error) {
    console.error('Error refreshing part info:', error);
    return NextResponse.json(
      { error: '部品情報の再更新に失敗しました' },
      { status: 500 }
    );
  }
} 