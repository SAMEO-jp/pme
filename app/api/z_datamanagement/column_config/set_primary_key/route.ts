import { NextResponse } from 'next/server'
import { getDbConnection } from '@/lib/db_utils'

export async function POST(request: Request) {
  try {
    const { tableName, columnName } = await request.json()

    if (!tableName || !columnName) {
      return NextResponse.json(
        { error: 'テーブル名とカラム名は必須です' },
        { status: 400 }
      )
    }

    const db = await getDbConnection()

    // テーブルの存在確認
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName]
    )

    if (!tableExists) {
      return NextResponse.json(
        { error: '指定されたテーブルが存在しません' },
        { status: 404 }
      )
    }

    // カラムの存在確認
    const columns = await db.all(`PRAGMA table_info(${tableName})`)
    const columnExists = columns.some((col: any) => col.name === columnName)

    if (!columnExists) {
      return NextResponse.json(
        { error: '指定されたカラムが存在しません' },
        { status: 404 }
      )
    }

    // 既存の主キーを確認
    const existingPk = columns.find((col: any) => col.pk === 1)
    if (existingPk) {
      // 既存の主キーを削除
      const tempTableName = `${tableName}_temp_pk`
      const colDefs = columns.map((col: any) => {
        let def = `"${col.name}" ${col.type}`
        if (col.notnull === 1) def += ' NOT NULL'
        if (col.dflt_value !== null && col.dflt_value !== undefined) def += ` DEFAULT ${col.dflt_value}`
        return def
      })

      // 一時テーブルを作成
      const createSQL = `CREATE TABLE "${tempTableName}" (${colDefs.join(', ')})`
      await db.run(createSQL)

      // データを移行
      const colNames = columns.map((col: any) => `"${col.name}"`).join(', ')
      await db.run(`INSERT INTO "${tempTableName}" (${colNames}) SELECT ${colNames} FROM "${tableName}"`)

      // 元のテーブルを削除
      await db.run(`DROP TABLE "${tableName}"`)

      // 一時テーブルをリネーム
      await db.run(`ALTER TABLE "${tempTableName}" RENAME TO "${tableName}"`)
    }

    // 新しい主キーを設定
    const newTempTableName = `${tableName}_temp_pk_new`
    const newColDefs = columns.map((col: any) => {
      let def = `"${col.name}" ${col.type}`
      if (col.notnull === 1) def += ' NOT NULL'
      if (col.dflt_value !== null && col.dflt_value !== undefined) def += ` DEFAULT ${col.dflt_value}`
      if (col.name === columnName) def += ' PRIMARY KEY'
      return def
    })

    // 新しい一時テーブルを作成
    const newCreateSQL = `CREATE TABLE "${newTempTableName}" (${newColDefs.join(', ')})`
    await db.run(newCreateSQL)

    // データを移行
    const colNames = columns.map((col: any) => `"${col.name}"`).join(', ')
    await db.run(`INSERT INTO "${newTempTableName}" (${colNames}) SELECT ${colNames} FROM "${tableName}"`)

    // 元のテーブルを削除
    await db.run(`DROP TABLE "${tableName}"`)

    // 新しい一時テーブルをリネーム
    await db.run(`ALTER TABLE "${newTempTableName}" RENAME TO "${tableName}"`)

    // d_culum_styleテーブルを更新
    await db.run(
      `UPDATE d_culum_style SET isKey = CASE WHEN columnName = ? THEN 1 ELSE 0 END WHERE tableName = ?`,
      [columnName, tableName]
    )

    return NextResponse.json({ message: '主キーが正常に設定されました' })
  } catch (error) {
    console.error('主キー設定エラー:', error)
    return NextResponse.json(
      { error: '主キーの設定に失敗しました' },
      { status: 500 }
    )
  }
} 