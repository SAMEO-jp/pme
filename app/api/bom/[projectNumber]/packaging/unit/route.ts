import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: 梱包単位の一覧を取得
export async function GET(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const konpoUnits = await db.all(`
      SELECT 
        kt.KONPO_TANNI_ID,
        kt.ZUMEN_ID,
        kt.PART_ID,
        CAST(kt.PART_KO AS REAL) AS PART_KO,
        CAST(kt.ZENSU_KO AS REAL) AS ZENSU_KO,
        COALESCE(SUM(CAST(bb.BUZAI_WEIGHT AS REAL)), 0) AS BUZAI_WEIGHT,
        ROUND(COALESCE(SUM(CAST(bb.BUZAI_WEIGHT AS REAL)), 0) * CAST(kt.PART_KO AS REAL), 2) AS TOTAL_WEIGHT,
        kt.KONPO_LIST_ID
      FROM KONPO_TANNI kt
      LEFT JOIN BOM_BUZAI bb ON kt.PART_ID = bb.PART_ID AND kt.ZUMEN_ID = bb.ZUMEN_ID
      GROUP BY kt.KONPO_TANNI_ID, kt.ZUMEN_ID, kt.PART_ID, kt.PART_KO, kt.ZENSU_KO, kt.KONPO_LIST_ID
      ORDER BY kt.KONPO_TANNI_ID
    `);

    // 数値変換
    const konpoUnitsFixed = konpoUnits.map(unit => ({
      ...unit,
      PART_KO: Number(unit.PART_KO),
      ZENSU_KO: Number(unit.ZENSU_KO),
      BUZAI_WEIGHT: Number(unit.BUZAI_WEIGHT),
      TOTAL_WEIGHT: Number(unit.TOTAL_WEIGHT),
    }));

    console.log('GET /api/bom/[projectNumber]/packaging/unit - Response:', konpoUnitsFixed);
    return NextResponse.json(konpoUnitsFixed);
  } catch (error) {
    console.error('Error fetching konpo units:', error);
    return NextResponse.json(
      { error: '梱包単位の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// POST: 新しい梱包単位を作成
export async function POST(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const body = await request.json();
    console.log('POST /api/bom/[projectNumber]/packaging/unit - Request body:', body);
    const { PART_ID, ZUMEN_ID, PART_KO, ZENSU_KO } = body;

    // 既存の梱包単位をチェック（プロジェクトIDも含めて）
    const existingUnit = await db.get(`
      SELECT kt.* 
      FROM KONPO_TANNI kt
      INNER JOIN BOM_PART bp ON kt.PART_ID = bp.PART_ID
      WHERE kt.PART_ID = ? 
      AND kt.ZUMEN_ID = ?
      AND bp.PART_PROJECT_ID = ?
    `, [PART_ID, ZUMEN_ID, params.projectNumber]);

    if (existingUnit) {
      console.log('Part already has a konpo unit:', existingUnit);
      return NextResponse.json(
        { error: 'この部品は既に梱包単位に登録されています' },
        { status: 400 }
      );
    }

    // 部品がプロジェクトに存在するか確認し、数量も取得
    const partInfo = await db.get(`
      SELECT bp.PART_ID, bp.QUANTITY
      FROM BOM_PART bp
      WHERE bp.PART_ID = ? 
      AND bp.PART_PROJECT_ID = ?
    `, [PART_ID, params.projectNumber]);

    if (!partInfo) {
      return NextResponse.json(
        { error: '指定された部品はこのプロジェクトに存在しません' },
        { status: 400 }
      );
    }

    // 新しい梱包単位を作成
    const quantity = Number(partInfo.QUANTITY) || 0;

    // 部品番号を2桁表示に変換（1桁の場合は先頭に0を付加）
    const paddedPartId = PART_ID.padStart(2, '0');

    // KONPO_TANNI_IDを生成（KT-図面ID-部品番号）
    const newKonpoTanniId = `KT-${ZUMEN_ID}-${paddedPartId}`;

    const result = await db.run(
      `INSERT INTO KONPO_TANNI (
        KONPO_TANNI_ID,
        ZUMEN_ID,
        PART_ID,
        PART_KO,
        ZENSU_KO
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        newKonpoTanniId,
        ZUMEN_ID,
        PART_ID,
        quantity,
        quantity
      ]
    );

    console.log('Created new konpo unit:', result);
    return NextResponse.json({
      message: '梱包単位を作成しました',
      id: result.lastID
    });
  } catch (error) {
    console.error('Error creating konpo unit:', error);
    return NextResponse.json(
      { error: '梱包単位の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// PUT: 梱包単位を更新
export async function PUT(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const body = await request.json();
    const { KONPO_TANNI_ID, PART_KO, ZENSU_KO } = body;

    await db.run(
      `UPDATE KONPO_TANNI 
       SET PART_KO = ?, ZENSU_KO = ?
       WHERE KONPO_TANNI_ID = ?`,
      [PART_KO, ZENSU_KO, KONPO_TANNI_ID]
    );

    return NextResponse.json({ message: '梱包単位を更新しました' });
  } catch (error) {
    console.error('Error updating konpo unit:', error);
    return NextResponse.json(
      { error: '梱包単位の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE: 梱包単位を削除
export async function DELETE(
  request: Request,
  { params }: { params: { projectNumber: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const KONPO_TANNI_ID = searchParams.get('id');

    if (!KONPO_TANNI_ID) {
      return NextResponse.json(
        { error: '梱包単位IDが必要です' },
        { status: 400 }
      );
    }

    await db.run(
      'DELETE FROM KONPO_TANNI WHERE KONPO_TANNI_ID = ?',
      [KONPO_TANNI_ID]
    );

    return NextResponse.json({ message: '梱包単位を削除しました' });
  } catch (error) {
    console.error('Error deleting konpo unit:', error);
    return NextResponse.json(
      { error: '梱包単位の削除に失敗しました' },
      { status: 500 }
    );
  }
}
