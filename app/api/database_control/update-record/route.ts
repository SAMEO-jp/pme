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
    const { tableName, record, primaryKey, originalPrimaryKeyValue } = await request.json()

    if (!tableName || !record || !primaryKey) {
      return NextResponse.json({ error: "テーブル名、レコードデータ、主キー情報は必須です" }, { status: 400 })
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

    // 主キーカラムを特定
    const pkColumn = tableInfo.find((col) => col.pk === 1)
    if (!pkColumn) {
      await db.close()
      return NextResponse.json({ error: `テーブル "${tableName}" に主キーが見つかりません` }, { status: 400 })
    }

    // トランザクション開始
    await db.run("BEGIN TRANSACTION")

    try {
      let result

      // 主キーの値が変更されたかどうかを確認
      const isPrimaryKeyChanged =
        originalPrimaryKeyValue !== undefined && record[primaryKey] !== originalPrimaryKeyValue

      if (isPrimaryKeyChanged) {
        // 主キーが変更された場合は、新しいレコードを挿入して古いレコードを削除

        // 既存のレコードを取得
        const existingRecord = await db.get(`SELECT * FROM ${tableName} WHERE ${primaryKey} = ?`, [
          originalPrimaryKeyValue,
        ])

        if (!existingRecord) {
          throw new Error(`主キー値 "${originalPrimaryKeyValue}" のレコードが見つかりません`)
        }

        // 新しい主キー値で既存のレコードが存在するか確認
        const duplicateCheck = await db.get(`SELECT * FROM ${tableName} WHERE ${primaryKey} = ?`, [record[primaryKey]])

        if (duplicateCheck) {
          throw new Error(`主キー値 "${record[primaryKey]}" は既に存在します`)
        }

        // 新しいレコードを挿入
        const columns = Object.keys(record)
        const placeholders = columns.map(() => "?").join(", ")
        const values = columns.map((col) => record[col])

        result = await db.run(`INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`, values)

        // 古いレコードを削除
        await db.run(`DELETE FROM ${tableName} WHERE ${primaryKey} = ?`, [originalPrimaryKeyValue])
      } else {
        // 主キーが変更されていない場合は通常の更新
        const columns = Object.keys(record).filter((key) => key !== primaryKey)
        if (columns.length === 0) {
          await db.run("ROLLBACK")
          await db.close()
          return NextResponse.json({ error: "更新するカラムがありません" }, { status: 400 })
        }

        const setClause = columns.map((col) => `${col} = ?`).join(", ")
        const values = columns.map((col) => record[col])
        values.push(record[primaryKey]) // WHERE句の値

        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${primaryKey} = ?`

        // クエリの実行
        result = await db.run(query, values)
      }

      // トランザクションをコミット
      await db.run("COMMIT")

      // データベースを閉じる
      await db.close()

      return NextResponse.json({
        success: true,
        message: `レコードが正常に更新されました。`,
        changes: result.changes,
      })
    } catch (error) {
      // エラー発生時はロールバック
      await db.run("ROLLBACK")
      await db.close()

      return NextResponse.json(
        {
          error: `レコード更新中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("レコード更新エラー:", error)
    return NextResponse.json(
      {
        error: `レコード更新中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
      },
      { status: 500 },
    )
  }
}
