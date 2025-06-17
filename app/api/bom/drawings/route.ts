import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectNumber = searchParams.get('projectNumber');
  const drawingId = searchParams.get('drawingId');
  const partId = searchParams.get('partId');

  if (!projectNumber) {
    return NextResponse.json({ error: 'Project number is required' }, { status: 400 });
  }

  try {
    // 部品詳細用: BOM_BUZAI明細取得
    if (drawingId && partId) {
      const buzaiList = await db.all(`
        SELECT 
          Buzai_ID,
          ZAISITU_name,
          unit_weight,
          quantity,
          (unit_weight * quantity) as total_weight
        FROM BOM_BUZAI
        WHERE Zumen_ID = ? AND PART_ID = ?
        ORDER BY Buzai_ID
      `, [drawingId, partId]);
      return NextResponse.json({ buzaiList });
    }

    if (drawingId) {
      // 図面に使用されている部品一覧を取得
      const parts = await db.all(`
        SELECT 
          p.PART_ID as "PART_ID",
          p.part_name as "part_name",
          p.manufacturer as "manufacturer",
          IFNULL(SUM(b.unit_weight * b.quantity), 0) as total_weight
        FROM BOM_PART p
        LEFT JOIN BOM_BUZAI b
          ON p.Zumen_ID = b.Zumen_ID AND p.PART_ID = b.PART_ID
        WHERE p.Zumen_ID = ?
        GROUP BY p.PART_ID, p.part_name, p.manufacturer
        ORDER BY p.PART_ID
      `, [drawingId]);

      console.log('Fetched parts:', parts); // デバッグ用ログ

      // 図面情報を取得
      const drawing = await db.get(`
        SELECT *
        FROM BOM_Zume
        WHERE Zumen_ID = ?
      `, [drawingId]);

      return NextResponse.json({
        drawing,
        parts
      });
    }

    // プロジェクトの図面一覧を取得
    const drawings = await db.all(`
      SELECT *
      FROM BOM_Zume
      WHERE project_ID = ?
      ORDER BY Zumen_ID
    `, [projectNumber]);

    return NextResponse.json(drawings);
  } catch (error) {
    console.error('Error fetching drawings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drawings' },
      { status: 500 }
    );
  }
} 