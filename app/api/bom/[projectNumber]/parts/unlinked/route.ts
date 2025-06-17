import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    // BOM_PARTテーブルから、KONPO_TANNIテーブルに未連携の部品を取得
    const unlinkedParts = await db.all(`
      SELECT DISTINCT
        bp.PART_ID,
        bp.PART_NAME,
        bp.MANUFACTURER,
        bp.ZUMEN_ID
      FROM BOM_PART bp
      LEFT JOIN KONPO_TANNI kt ON bp.PART_ID = kt.PART_ID
      WHERE bp.PART_PROJECT_ID = ?
        AND kt.PART_ID IS NULL
    `, [params.projectNumber]);

    return NextResponse.json(unlinkedParts);
  } catch (error) {
    console.error('Error fetching unlinked parts:', error);
    return NextResponse.json(
      { error: '未連携部品の取得に失敗しました' },
      { status: 500 }
    );
  }
} 