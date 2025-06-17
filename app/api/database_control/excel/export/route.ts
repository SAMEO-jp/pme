import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"
import * as XLSX from "xlsx"

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

    // テーブルのデータを取得
    const rows = await db.all(`SELECT * FROM ${tableName}`)

    // データベースを閉じる
    await db.close()

    // ヘッダー行を取得
    const headers = tableInfo.map((column) => column.name)

    // xlsxワークブックを作成
    const workbook = XLSX.utils.book_new()

    // データをワークシートに変換
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers })

    // ワークシートをワークブックに追加
    XLSX.utils.book_append_sheet(workbook, worksheet, tableName)

    // Excelファイルをバッファとして生成
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    // ファイル名を生成
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const excelFileName = `${tableName}_${timestamp}.xlsx`

    // バッファを直接レスポンスとして返す
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${excelFileName}"`,
      },
    })
  } catch (error) {
    console.error("Excelエクスポートエラー:", error)
    return NextResponse.json(
      { error: `Excelエクスポート中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
