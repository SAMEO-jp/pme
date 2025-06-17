import sqlite3 from "sqlite3"
import { open, type Database } from "sqlite"
import path from "path"

// データベース接続を取得する関数
let db: Database | null = null

export async function getDb() {
  if (db) return db

  // データベースファイルのパス
  const dbPath = path.resolve(process.cwd(), "data/achievements.db")

  // データベース接続を開く
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // テーブル情報の確認は静かに行う
  try {
    await db.all("PRAGMA table_info(bumon)")
  } catch (error) {
    // エラーは無視する
  }

  return db
}

// データベース接続を閉じる関数
export async function closeDb() {
  if (db) {
    await db.close()
    db = null
  }
}

// テーブル構造を確認するユーティリティ関数
export async function checkTableStructure() {
  const db = await getDb()
  try {
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    const tableStructures: Record<string, any[]> = {}
    
    for (const table of tables) {
      const columns = await db.all(`PRAGMA table_info(${table.name})`)
      tableStructures[table.name] = columns
    }
    return { success: true, tables: tableStructures }
  } catch (error) {
    return { success: false, error }
  }
}
