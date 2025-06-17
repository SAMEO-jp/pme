import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// データベースへの接続を取得
async function getDb() {
  return open({
    filename: './data/achievements.db',
    driver: sqlite3.Database
  })
}

export async function POST() {
  try {
    const db = await getDb()
    
    // d_culum_styleテーブルが存在するか確認
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name = 'd_culum_style'"
    )
    
    if (!tableExists) {
      // テーブルが存在しない場合は作成
      await db.exec(`
        CREATE TABLE IF NOT EXISTS d_culum_style (
          table_name TEXT NOT NULL,
          column_name TEXT NOT NULL,
          display_name TEXT,
          is_key INTEGER DEFAULT 0,
          column_type TEXT,
          PRIMARY KEY (table_name, column_name)
        )
      `)
      
      // 既存のテーブルとカラム情報を取得して初期データを設定
      const tables = await db.all(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
      )
      
      // 各テーブルのカラム情報を取得し、d_culum_styleに登録
      for (const table of tables) {
        const columns = await db.all(`PRAGMA table_info(${table.name})`)
        
        for (const column of columns) {
          // 既に登録されているか確認
          const existingConfig = await db.get(
            `SELECT * FROM d_culum_style WHERE table_name = ? AND column_name = ?`,
            [table.name, column.name]
          )
          
          if (!existingConfig) {
            // 未登録の場合は挿入
            await db.run(
              `INSERT INTO d_culum_style (table_name, column_name, display_name, is_key, column_type) 
               VALUES (?, ?, ?, ?, ?)`,
              [table.name, column.name, column.name, column.pk, column.type]
            )
          }
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'd_culum_styleテーブルを作成し、初期データを設定しました' 
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'd_culum_styleテーブルは既に存在しています' 
      })
    }
  } catch (error) {
    console.error('d_culum_styleテーブル作成エラー:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'd_culum_styleテーブルの作成に失敗しました' 
      },
      { status: 500 }
    )
  }
} 