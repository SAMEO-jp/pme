import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DB_PATH = path.join(process.cwd(), "data", "achievements.db")

/**
 * データベース接続を取得する関数
 * @returns SQLiteデータベース接続
 */
export async function getDbConnection() {
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
 * トランザクションを使用してデータベース操作を行う関数
 * @param callback トランザクション内で実行するコールバック関数
 * @returns コールバック関数の戻り値
 */
export async function withTransaction<T>(callback: (db: any) => Promise<T>): Promise<T> {
  const db = await getDbConnection()

  try {
    // トランザクション開始
    await db.run("BEGIN TRANSACTION")

    // コールバック関数を実行
    const result = await callback(db)

    // トランザクションをコミット
    await db.run("COMMIT")

    return result
  } catch (error) {
    // エラーが発生した場合はロールバック
    await db.run("ROLLBACK")
    console.error("トランザクション中にエラーが発生しました:", error)
    throw error
  } finally {
    // データベース接続を閉じる
    await db.close()
  }
}

/**
 * データベースが初期化されているか確認する関数
 * @returns 初期化されているかどうかのブール値
 */
export async function isDatabaseInitialized() {
  try {
    const db = await getDbConnection()

    // main_Zissekiテーブルが存在するか確認
    const result = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='main_Zisseki'")

    await db.close()

    return !!result
  } catch (error) {
    console.error("データベース確認中にエラーが発生しました:", error)
    return false
  }
}

/**
 * データベースのテーブルを作成する関数
 * 警告: このバージョンでは、直接テーブルを作成する機能は削除されています。
 * データベース操作はdatabase_controlモジュールを使用してください。
 */
export async function createTables() {
  console.warn("警告: この関数は廃止されました。テーブル作成はdatabase_controlモジュールを使用してください。")
  console.warn("Warning: This function is deprecated. Please use the database_control module for table creation.")
  return { success: false, message: "Function deprecated. Use database_control module instead." }
}
