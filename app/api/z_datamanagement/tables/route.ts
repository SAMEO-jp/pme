import { NextResponse } from 'next/server'
import { getDbConnection } from "@/lib/db_utils"

export async function GET() {
  try {
    const db = await getDbConnection()
    
    // まずテーブル一覧を取得
    const tables = await db.all(`
      SELECT name 
      FROM sqlite_master 
      WHERE type = 'table' 
      AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `)

    // 次に種別情報を取得
    const kinds = await db.all(`
      SELECT tablename, kind, tablename_yomi 
      FROM d_datakind
    `)

    // テーブルと種別情報を結合
    const tablesWithKind = tables.map(table => {
      const kindInfo = kinds.find(k => k.tablename === table.name)
      return {
        name: table.name,
        kind: kindInfo?.kind || null,
        tablename_yomi: kindInfo?.tablename_yomi || null
      }
    })

    console.log('取得したテーブルデータ:', tablesWithKind) // デバッグ用

    return NextResponse.json({ tables: tablesWithKind })
  } catch (error) {
    console.error("テーブル一覧取得エラー:", error)
    return NextResponse.json(
      { error: "テーブル一覧の取得に失敗しました" },
      { status: 500 }
    )
  }
} 