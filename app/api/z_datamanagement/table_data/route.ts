import { NextRequest, NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

interface ColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: any
  pk: number
}

interface RunResult {
  lastID?: number
  changes?: number
}

// データベースへの接続を取得
async function getDb() {
  return open({
    filename: path.join(process.cwd(), 'data/achievements.db'),
    driver: sqlite3.Database
  })
}

// テーブル情報を取得する関数
async function getTableInfo(db: any, tableName: string) {
  try {
    const table = await db.get(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name=?
    `, [tableName])
    return table
  } catch (error) {
    console.error('テーブル情報取得エラー:', error)
    return null
  }
}

// テーブルの主キーを取得する関数
async function getPrimaryKey(db: any, tableName: string) {
  try {
    const columnsInfo = await db.all(`PRAGMA table_info(${tableName})`) as ColumnInfo[]
    const pkColumn = columnsInfo.find((col: ColumnInfo) => col.pk === 1)
    return pkColumn ? pkColumn.name : null
  } catch (error) {
    console.error('主キー取得エラー:', error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tableName = searchParams.get('table')
    const limit = parseInt(searchParams.get('limit') || '500')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    if (!tableName) {
      return NextResponse.json({ error: 'テーブル名が指定されていません' }, { status: 400 })
    }

    const db = await getDb()
    const tableInfo = await getTableInfo(db, tableName)
    
    if (!tableInfo) {
      return NextResponse.json({ error: 'テーブルが見つかりません' }, { status: 404 })
    }

    // 主キーを取得
    const primaryKey = await getPrimaryKey(db, tableName)
    const orderByClause = primaryKey ? `ORDER BY ${primaryKey} DESC` : ''

    // 最大500件までに制限
    const safeLimit = Math.min(limit, 500)
    
    const rows = await db.all(`
      SELECT * FROM ${tableName}
      ${orderByClause}
      LIMIT ? OFFSET ?
    `, [safeLimit, offset])

    await db.close()
    return NextResponse.json({ rows })
  } catch (error) {
    console.error('テーブルデータ取得エラー:', error)
    return NextResponse.json(
      { error: 'テーブルデータの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tableName = searchParams.get('table')
    
    if (!tableName) {
      return NextResponse.json({ error: 'テーブル名が指定されていません' }, { status: 400 })
    }

    const data = await request.json()

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: '無効なデータ形式です' }, { status: 400 })
    }

    const db = await getDb()
    const tableInfo = await getTableInfo(db, tableName)
    
    if (!tableInfo) {
      return NextResponse.json({ error: 'テーブルが見つかりません' }, { status: 404 })
    }

    const columns = Object.keys(data)
    const values = Object.values(data)
    const placeholders = values.map(() => '?').join(', ')

    const result = await db.run(`
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES (${placeholders})
    `, values) as RunResult

    await db.close()
    return NextResponse.json({ success: true, id: result.lastID })
  } catch (error) {
    console.error('データ追加エラー:', error)
    return NextResponse.json(
      { error: 'データの追加に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const tableName = url.searchParams.get('table')
    const all = url.searchParams.get('all') === 'true'
    
    if (!tableName) {
      return NextResponse.json({ success: false, error: 'テーブル名は必須です' }, { status: 400 })
    }

    const db = await getDb()
    
    if (all) {
      // 全レコード削除
      await db.run(`DELETE FROM ${tableName}`)
      await db.close()
      return NextResponse.json({ success: true, deleted: 'all' })
    }

    // リクエストボディから削除対象のキーを取得
    const body = await request.json()
    const { keys } = body

    if (!keys || !Array.isArray(keys)) {
      return NextResponse.json({ success: false, error: '削除対象のキーが指定されていません' }, { status: 400 })
    }

    // テーブルのカラム情報を取得
    const columnsInfo = await db.all(`PRAGMA table_info(${tableName})`) as ColumnInfo[]
    const pkColumns = columnsInfo.filter(col => col.pk === 1).map(col => col.name)
    
    if (pkColumns.length === 0) {
      return NextResponse.json({ success: false, error: '主キーが定義されていません' }, { status: 400 })
    }

    // 複数レコード削除対応
    let deletedCount = 0
    for (const keyObj of keys) {
      const where = pkColumns.map(col => `${col} = ?`).join(' AND ')
      const values = pkColumns.map(col => keyObj[col])
      const result = await db.run(`DELETE FROM ${tableName} WHERE ${where}`, values) as RunResult
      if (result?.changes && result.changes > 0) deletedCount++
    }

    await db.close()
    return NextResponse.json({ success: true, deleted: deletedCount })
  } catch (error) {
    console.error('レコード削除エラー:', error)
    return NextResponse.json({ success: false, error: 'レコード削除に失敗しました' }, { status: 500 })
  }
} 