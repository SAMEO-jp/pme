import { NextResponse } from 'next/server'
import { getDbConnection } from "@/lib/db_utils"

interface GroupedKind {
  kind: string
  tables: string[]
}

export async function GET() {
  try {
    const db = await getDbConnection()
    
    // d_datakindテーブルから種別データを取得
    const kinds = await db.all(`
      SELECT tablename, kind FROM d_datakind
      ORDER BY kind, tablename
    `)

    // 種別ごとにグループ化
    const groupedKinds = kinds.reduce((acc: GroupedKind[], curr) => {
      const existingGroup = acc.find(group => group.kind === curr.kind)
      if (existingGroup) {
        existingGroup.tables.push(curr.tablename)
      } else {
        acc.push({
          kind: curr.kind,
          tables: [curr.tablename]
        })
      }
      return acc
    }, [])

    return NextResponse.json({ kinds: groupedKinds })
  } catch (error) {
    console.error("種別データ取得エラー:", error)
    return NextResponse.json(
      { error: "種別データの取得に失敗しました" },
      { status: 500 }
    )
  }
} 