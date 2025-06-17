import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  try {
    // ユーザーデータを取得
    const users = await db.all(`
      SELECT 
        user_id as id,
        name_japanese as name,
        syokui as position,
        bumon as department,
        sitsu as section,
        ka as team,
        mail as email,
        TEL_naisen as telNaisen,
        TEL as telGaisen,
        company,
        name_english,
        name_yomi,
        in_year,
        Kengen as authority
      FROM all_user
      ORDER BY 
        CASE syokui
          WHEN '所長' THEN 1
          WHEN '部長' THEN 2
          WHEN '室長' THEN 3
          WHEN '課長' THEN 4
          ELSE 5
        END,
        bumon,
        name_japanese
    `);

    return NextResponse.json(users);
  } catch (error) {
    console.error('ユーザーデータ取得エラー:', error);
    return NextResponse.json(
      { error: 'ユーザーデータの取得に失敗しました' },
      { status: 500 }
    );
  }
} 