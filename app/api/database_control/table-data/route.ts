import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "achievements.db")

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tableName = searchParams.get("tableName")
    const sortColumn = searchParams.get("sortColumn") || ""
    const sortDirection = searchParams.get("sortDirection") || "asc"
    const filters = searchParams.get("filters") ? JSON.parse(searchParams.get("filters") || "{}") : {}

    if (!tableName) {
      return NextResponse.json({ error: "テーブル名は必須です" }, { status: 400 })
    }

    // データベースファイルが存在するか確認
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ error: `データベースファイルが見つかりません` }, { status: 404 })
    }

    // SQLiteデータベースを開く
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })

    // テーブルが存在するか確認
    const tableExists = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`, [tableName])

    if (!tableExists) {
      await db.close()
      return NextResponse.json({ error: `テーブル "${tableName}" が見つかりません` }, { status: 404 })
    }

    // テーブル情報を取得
    const tableInfo = await db.all(`PRAGMA table_info(${tableName})`)
    const columns = tableInfo.map((column) => column.name)

    // WHERE句の構築
    let whereClause = ""
    const whereParams: any[] = []

    if (Object.keys(filters).length > 0) {
      const filterConditions = []

      for (const [column, value] of Object.entries(filters)) {
        if (columns.includes(column) && value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            // 複数の値（IN句）
            if (value.length > 0) {
              const placeholders = value.map(() => "?").join(", ")
              filterConditions.push(`${column} IN (${placeholders})`)
              whereParams.push(...value)
            }
          } else if (typeof value === "object" && value !== null) {
            // 範囲検索
            if (value.min !== undefined && value.min !== null && value.min !== "") {
              filterConditions.push(`${column} >= ?`)
              whereParams.push(value.min)
            }
            if (value.max !== undefined && value.max !== null && value.max !== "") {
              filterConditions.push(`${column} <= ?`)
              whereParams.push(value.max)
            }
          } else {
            // 単一の値（完全一致）
            filterConditions.push(`${column} = ?`)
            whereParams.push(value)
          }
        }
      }

      if (filterConditions.length > 0) {
        whereClause = `WHERE ${filterConditions.join(" AND ")}`
      }
    }

    // ORDER BY句の構築
    let orderByClause = ""
    if (sortColumn && columns.includes(sortColumn)) {
      const direction = sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC"
      orderByClause = `ORDER BY ${sortColumn} ${direction}`
    }

    // クエリの実行
    const query = `SELECT * FROM ${tableName} ${whereClause} ${orderByClause}`
    const rows = await db.all(query, whereParams)

    // データベースを閉じる
    await db.close()

    return NextResponse.json({
      success: true,
      columns,
      data: rows,
      total: rows.length,
    })
  } catch (error) {
    console.error("テーブルデータ取得エラー:", error)
    return NextResponse.json(
      {
        error: `テーブルデータの取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
