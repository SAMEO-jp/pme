import { type NextRequest, NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DATA_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DATA_DIR, "achievements.db")

export async function POST(request: NextRequest) {
  try {
    const { tableName, newStructure, oldStructure } = await request.json()

    if (!tableName || !newStructure || !oldStructure) {
      return NextResponse.json({ error: "テーブル名、新しい構造、および元の構造は必須です" }, { status: 400 })
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

    // トランザクション開始
    await db.run("BEGIN TRANSACTION")

    try {
      // 一時テーブル名を生成
      const tempTableName = `temp_${tableName}_${Date.now()}`

      // 新しい構造でテンポラリテーブルを作成
      const createTempTableSQL = generateCreateTableSQL(tempTableName, newStructure)
      await db.exec(createTempTableSQL)

      // 元のテーブルから新しいテーブルにデータをコピー
      const oldColumns = oldStructure.map((col) => col.name)
      const newColumns = newStructure.map((col) => col.name)

      // 元のテーブルのデータを取得
      const rows = await db.all(`SELECT * FROM ${tableName}`)

      // 各行を新しいテーブルに挿入
      for (const row of rows) {
        const insertValues = []
        const placeholders = []

        // 新しい構造の各カラムに対して値を設定
        for (const col of newStructure) {
          if (oldColumns.includes(col.name)) {
            // 既存のカラムの場合
            let value = row[col.name]

            // NULL値チェック - NOT NULL制約があるが値がNULLの場合はデフォルト値を設定
            if (value === null && col.notnull === 1) {
              // データ型に応じたデフォルト値を設定
              switch (col.type.toUpperCase()) {
                case "INTEGER":
                case "REAL":
                case "NUMERIC":
                  value = 0
                  break
                case "TEXT":
                  value = ""
                  break
                case "BOOLEAN":
                  value = false
                  break
                case "DATE":
                  value = new Date().toISOString().split("T")[0] // YYYY-MM-DD
                  break
                case "DATETIME":
                  value = new Date().toISOString().replace("T", " ").split(".")[0] // YYYY-MM-DD HH:MM:SS
                  break
                default:
                  value = ""
              }
            }

            insertValues.push(value)
          } else {
            // 新しいカラムの場合はデフォルト値を設定
            if (col.notnull === 1 && col.pk !== 1) {
              // NOT NULL制約があるが主キーでない場合、データ型に応じたデフォルト値を設定
              switch (col.type.toUpperCase()) {
                case "INTEGER":
                case "REAL":
                case "NUMERIC":
                  insertValues.push(0)
                  break
                case "TEXT":
                  insertValues.push("")
                  break
                case "BOOLEAN":
                  insertValues.push(false)
                  break
                case "DATE":
                  insertValues.push(new Date().toISOString().split("T")[0]) // YYYY-MM-DD
                  break
                case "DATETIME":
                  insertValues.push(new Date().toISOString().replace("T", " ").split(".")[0]) // YYYY-MM-DD HH:MM:SS
                  break
                default:
                  insertValues.push("")
              }
            } else {
              // NULL許容の場合はNULLを設定
              insertValues.push(null)
            }
          }
          placeholders.push("?")
        }

        // 新しいテーブルに行を挿入
        const insertSQL = `INSERT INTO ${tempTableName} (${newColumns.join(", ")}) VALUES (${placeholders.join(", ")})`
        await db.run(insertSQL, insertValues)
      }

      // 元のテーブルを削除
      await db.exec(`DROP TABLE ${tableName}`)

      // テンポラリテーブルをリネーム
      await db.exec(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`)

      // トランザクションをコミット
      await db.run("COMMIT")

      // データベースを閉じる
      await db.close()

      return NextResponse.json({
        success: true,
        message: `テーブル "${tableName}" の構造が正常に更新されました。`,
      })
    } catch (error) {
      // エラー発生時はロールバック
      await db.run("ROLLBACK")
      await db.close()
      throw error
    }
  } catch (error) {
    console.error("テーブル構造更新エラー:", error)
    return NextResponse.json(
      {
        error: `テーブル構造の更新中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}

// テーブル作成SQLを生成する関数
function generateCreateTableSQL(tableName: string, structure: any[]): string {
  if (!structure.length) {
    return "-- フィールドが定義されていません"
  }

  const fieldDefinitions = structure.map((field) => {
    let definition = `"${field.name}" ${field.type}`

    if (field.pk === 1) {
      definition += " PRIMARY KEY"
    }

    if (field.notnull === 1 && field.pk !== 1) {
      definition += " NOT NULL"
    }

    // デフォルト値を設定
    if (field.notnull === 1 && field.pk !== 1) {
      switch (field.type.toUpperCase()) {
        case "INTEGER":
        case "REAL":
        case "NUMERIC":
          definition += " DEFAULT 0"
          break
        case "TEXT":
          definition += " DEFAULT ''"
          break
        case "BOOLEAN":
          definition += " DEFAULT 0"
          break
        case "DATE":
          definition += " DEFAULT CURRENT_DATE"
          break
        case "DATETIME":
          definition += " DEFAULT CURRENT_TIMESTAMP"
          break
      }
    }

    return definition
  })

  return `CREATE TABLE IF NOT EXISTS "${tableName}" (
  ${fieldDefinitions.join(",\n  ")}
);`
}
