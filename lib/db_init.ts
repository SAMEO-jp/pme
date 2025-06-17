import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DB_PATH = path.join(process.cwd(), "data", "achievements.db")

/**
 * データベースの初期化と接続を行う関数
 * @returns SQLiteデータベース接続
 */
export async function initializeDatabase() {
  // データディレクトリが存在しない場合は作成
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // データベースに接続
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  })

  // 外部キー制約を有効化
  await db.run("PRAGMA foreign_keys = ON")

  return db
}

/**
 * データベースが初期化されているか確認する関数
 * @returns 初期化されているかどうかのブール値
 */
export async function isDatabaseInitialized() {
  try {
    const db = await initializeDatabase()

    // main_Zissekiテーブルが存在するか確認
    const result = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='main_Zisseki'")

    await db.close()

    return !!result
  } catch (error) {
    console.error("データベース確認中にエラーが発生しました:", error)
    return false
  }
}
