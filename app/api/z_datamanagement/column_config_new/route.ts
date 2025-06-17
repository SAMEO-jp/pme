import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { getDbConnection } from "@/lib/db_utils"
import { getColumnConfigs } from '@/app/z_datamanagement/lib/column_config'

// データベースへの接続を取得
async function getDb() {
  return open({
    filename: './data/achievements.db',
    driver: sqlite3.Database
  })
}

interface ColumnConfig {
  tableName: string
  columnName: string
  displayName: string
  isKey: boolean
  columnType: string
  newColumnName?: string  // カラム名変更用
}

// カラム名の比較（大文字小文字を区別しない）
function compareColumnNames(name1: string, name2: string): boolean {
  return name1.toLowerCase() === name2.toLowerCase()
}

export async function GET() {
  try {
    const columnConfigs = getColumnConfigs();
    return NextResponse.json(columnConfigs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch column configs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { tableName, columnName, displayName, isKey, columnType, newColumnName } = await request.json() as ColumnConfig
    const db = await getDbConnection()

    // テーブルの存在確認
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName]
    )

    if (!tableExists) {
      return NextResponse.json(
        { error: "指定されたテーブルが存在しません" },
        { status: 404 }
      )
    }

    // 既存のカラム情報を取得
    const columns = await db.all(`
      PRAGMA table_info(${tableName})
    `)

    // カラムの存在確認（大文字小文字を区別しない）
    const columnExists = columns.some(col => compareColumnNames(col.name, columnName))
    const newColumnExists = newColumnName ? columns.some(col => compareColumnNames(col.name, newColumnName)) : false

    // 新規カラム名が既に存在する場合はエラー
    if (newColumnExists) {
      return NextResponse.json(
        { error: "指定された新しいカラム名は既に使用されています（大文字小文字は区別されません）" },
        { status: 400 }
      )
    }

    // トランザクション開始
    await db.exec('BEGIN TRANSACTION')

    try {
      if (columnExists) {
        // カラム名の変更がある場合
        if (newColumnName && newColumnName !== columnName) {
          // 一時テーブルを作成
          const tempTableName = `${tableName}_temp`
          const createTempTableSQL = `
            CREATE TABLE ${tempTableName} (
              ${columns.map(col => {
                const isThisColumn = compareColumnNames(col.name, columnName)
                const columnDef = newColumnName && isThisColumn ? newColumnName : col.name
                const definition = `${columnDef} ${isThisColumn ? columnType : col.type}`
                return isThisColumn && isKey ? `${definition} PRIMARY KEY` : definition
              }).join(', ')}
            )
          `
          await db.run(createTempTableSQL)

          // データをコピー
          const columnList = columns.map(col => 
            compareColumnNames(col.name, columnName) && newColumnName ? newColumnName : col.name
          ).join(', ')
          await db.run(`INSERT INTO ${tempTableName} (${columnList}) SELECT ${columnList} FROM ${tableName}`)

          // 元のテーブルを削除
          await db.run(`DROP TABLE ${tableName}`)

          // 一時テーブルをリネーム
          await db.run(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`)
          
          // d_culum_styleの更新（カラム名変更）
          const existingStyle = await db.get(
            "SELECT * FROM d_culum_style WHERE table_name = ? AND column_name = ?",
            [tableName, columnName]
          )
          
          if (existingStyle) {
            // 既存のスタイル設定を更新
            await db.run(
              "UPDATE d_culum_style SET column_name = ?, display_name = ?, is_key = ?, column_type = ? WHERE table_name = ? AND column_name = ?",
              [newColumnName, displayName, isKey ? 1 : 0, columnType, tableName, columnName]
            )
          } else {
            // 新規スタイル設定を追加
            await db.run(
              "INSERT INTO d_culum_style (table_name, column_name, display_name, is_key, column_type) VALUES (?, ?, ?, ?, ?)",
              [tableName, newColumnName, displayName, isKey ? 1 : 0, columnType]
            )
          }
        } else {
          // カラム名変更なし、d_culum_styleの更新のみ
          const existingStyle = await db.get(
            "SELECT * FROM d_culum_style WHERE table_name = ? AND column_name = ?",
            [tableName, columnName]
          )
          
          if (existingStyle) {
            // 既存のスタイル設定を更新
            await db.run(
              "UPDATE d_culum_style SET display_name = ?, is_key = ?, column_type = ? WHERE table_name = ? AND column_name = ?",
              [displayName, isKey ? 1 : 0, columnType, tableName, columnName]
            )
          } else {
            // 新規スタイル設定を追加
            await db.run(
              "INSERT INTO d_culum_style (table_name, column_name, display_name, is_key, column_type) VALUES (?, ?, ?, ?, ?)",
              [tableName, columnName, displayName, isKey ? 1 : 0, columnType]
            )
          }
        }
      } else {
        // 新規カラムの追加
        const addColumnSQL = `
          ALTER TABLE ${tableName}
          ADD COLUMN ${columnName} ${columnType}${isKey ? ' PRIMARY KEY' : ''}
        `
        await db.run(addColumnSQL)
        
        // d_culum_styleに新規設定を追加
        await db.run(
          "INSERT INTO d_culum_style (table_name, column_name, display_name, is_key, column_type) VALUES (?, ?, ?, ?, ?)",
          [tableName, columnName, displayName, isKey ? 1 : 0, columnType]
        )
      }
      
      await db.exec('COMMIT')
      return NextResponse.json({ message: "カラムが正常に更新されました" })
    } catch (error) {
      await db.exec('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error("カラム設定エラー:", error)
    return NextResponse.json(
      { error: "カラムの設定に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { tableName, columnName, isKey } = await request.json();
    const db = await getDbConnection();

    // 既存のカラム情報を取得
    const columns = await db.all(`PRAGMA table_info(${tableName})`);
    // d_culum_styleのis_keyを更新
    await db.run(
      "UPDATE d_culum_style SET is_key = ? WHERE table_name = ? AND column_name = ?",
      [isKey ? 1 : 0, tableName, columnName]
    );
    // 新しい主キー構成を取得
    const keyRows = await db.all(
      "SELECT column_name FROM d_culum_style WHERE table_name = ? AND is_key = 1",
      [tableName]
    );
    const pkColumns = keyRows.map((row: any) => row.column_name);
    // CREATE TABLE文を再生成
    const tempTableName = `${tableName}_temp_pkchg`;
    const colDefs = columns.map((col: any) => {
      let def = `\"${col.name}\" ${col.type}`;
      if (col.notnull === 1 && !pkColumns.includes(col.name)) def += ' NOT NULL';
      if (col.dflt_value !== null && col.dflt_value !== undefined) def += ` DEFAULT ${col.dflt_value}`;
      return def;
    });
    let pkDef = pkColumns.length > 0 ? `, PRIMARY KEY (${pkColumns.map(n => `\"${n}\"`).join(', ')})` : '';
    const createSQL = `CREATE TABLE \"${tempTableName}\" (${colDefs.join(', ')}${pkDef})`;
    await db.run(createSQL);
    // データ移行
    const colNames = columns.map((col: any) => `\"${col.name}\"`).join(', ');
    await db.run(`INSERT INTO \"${tempTableName}\" (${colNames}) SELECT ${colNames} FROM \"${tableName}\"`);
    // 元テーブル削除・リネーム
    await db.run(`DROP TABLE \"${tableName}\"`);
    await db.run(`ALTER TABLE \"${tempTableName}\" RENAME TO \"${tableName}\"`);
    return NextResponse.json({ message: '主キー設定が更新されました' });
  } catch (error) {
    console.error('主キー設定エラー:', error);
    return NextResponse.json({ error: '主キー設定の更新に失敗しました' }, { status: 500 });
  }
} 