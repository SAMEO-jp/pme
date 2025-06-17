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
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database,
    })

    // 外部キー制約を有効化
    await db.run("PRAGMA foreign_keys = ON")

    await createTables(db)
    await db.close()
  } catch (error) {
    throw error
  }
}

async function createTables(db: Database): Promise<void> {
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS project_members (
        project_id INTEGER,
        employee_number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, employee_number),
        FOREIGN KEY (project_id) REFERENCES projects(id)
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_number TEXT NOT NULL,
        project_id INTEGER,
        date TEXT NOT NULL,
        hours REAL NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      );

      CREATE TABLE IF NOT EXISTS work_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_number TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT,
        end_time TEXT,
        break_time REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)
  } catch (error) {
    throw error
  }
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
