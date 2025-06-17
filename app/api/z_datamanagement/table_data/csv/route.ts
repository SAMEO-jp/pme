import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"
import { TextEncoder } from 'util'
import iconv from 'iconv-lite'

interface ImportOptions {
  noDuplicates: boolean
  createNewTable: boolean
  encoding: string
}

// 利用可能なエンコーディングのリスト
export const availableEncodings = [
  { value: 'UTF-8', label: 'UTF-8' },
  { value: 'Shift_JIS', label: 'Shift-JIS' },
  { value: 'EUC-JP', label: 'EUC-JP' },
  { value: 'ISO-8859-1', label: 'ISO-8859-1 (Latin-1)' }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tableName = searchParams.get('table')
    const encoding = searchParams.get('encoding') || 'UTF-8'

    if (!tableName) {
      return NextResponse.json(
        { error: "テーブル名が指定されていません" },
        { status: 400 }
      )
    }

    // エンコーディングの検証
    if (!availableEncodings.some(e => e.value === encoding)) {
      return NextResponse.json(
        { error: "指定されたエンコーディングはサポートされていません" },
        { status: 400 }
      )
    }

    const db = await getDbConnection()

    // テーブルのカラム情報を取得
    const columns = await db.all(`PRAGMA table_info(${tableName})`)
    
    // データを取得
    const rows = await db.all(`SELECT * FROM ${tableName}`)

    // CSVヘッダーを作成
    const headers = columns.map(col => col.name)
    
    // CSVデータを作成
    const csvRows = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          const value = row[header]
          // 値にカンマやダブルクォートが含まれる場合は適切にエスケープ
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',')
      )
    ]

    const csvContent = csvRows.join('\n')

    // 指定されたエンコーディングでエンコード
    let encodedContent: Buffer
    try {
      if (encoding === 'UTF-8') {
        encodedContent = Buffer.from(csvContent, 'utf-8')
      } else {
        // iconv-liteを使用してエンコード
        encodedContent = iconv.encode(csvContent, encoding)
      }
    } catch (error) {
      console.error("エンコーディングエラー:", error)
      return NextResponse.json(
        { error: "指定された文字エンコーディングでファイルを生成できませんでした" },
        { status: 400 }
      )
    }

    // CSVファイルとしてダウンロード
    return new NextResponse(encodedContent, {
      headers: {
        'Content-Type': `text/csv; charset=${encoding.toLowerCase()}`,
        'Content-Disposition': `attachment; filename="${tableName}.csv"`
      }
    })
  } catch (error) {
    console.error("CSVダウンロードエラー:", error)
    return NextResponse.json(
      { error: "CSVのダウンロードに失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tableName = searchParams.get('table')

    if (!tableName) {
      return NextResponse.json(
        { error: "テーブル名が指定されていません" },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const optionsJson = formData.get('options') as string
    const options: ImportOptions = optionsJson ? JSON.parse(optionsJson) : {
      noDuplicates: false,
      createNewTable: false,
      encoding: 'UTF-8'
    }

    if (!file) {
      return NextResponse.json(
        { error: "ファイルがアップロードされていません" },
        { status: 400 }
      )
    }

    // ファイルをArrayBufferとして読み込み
    const arrayBuffer = await file.arrayBuffer()
    
    // 指定されたエンコーディングでデコード
    let csvText: string
    try {
      const decoder = new TextDecoder(options.encoding)
      csvText = decoder.decode(arrayBuffer)
    } catch (error) {
      console.error("エンコーディングエラー:", error)
      return NextResponse.json(
        { error: "指定された文字エンコーディングでファイルを読み込めませんでした" },
        { status: 400 }
      )
    }

    const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim()))

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "CSVファイルの形式が不正です" },
        { status: 400 }
      )
    }

    const headers = rows[0]
    const data = rows.slice(1)

    const db = await getDbConnection()

    // 新規テーブルとしてインポートする場合
    if (options.createNewTable) {
      // 既存のテーブルを削除
      await db.exec(`DROP TABLE IF EXISTS ${tableName}`)

      // 新しいテーブルを作成
      const columnDefinitions = headers.map(header => `${header} TEXT`).join(', ')
      await db.exec(`CREATE TABLE ${tableName} (${columnDefinitions})`)

      // トランザクション開始
      await db.exec('BEGIN TRANSACTION')

      try {
        let insertedCount = 0
        let skippedCount = 0

        for (const row of data) {
          if (row.length !== headers.length) {
            skippedCount++
            continue
          }

          try {
            const placeholders = headers.map(() => '?').join(',')
            const sql = `INSERT INTO ${tableName} (${headers.join(',')}) VALUES (${placeholders})`
            await db.run(sql, row)
            insertedCount++
          } catch (error) {
            console.error('行の挿入エラー:', error)
            skippedCount++
          }
        }

        await db.exec('COMMIT')
        return NextResponse.json({
          message: "CSVデータのインポートが完了しました",
          stats: {
            inserted: insertedCount,
            updated: 0,
            skipped: skippedCount
          }
        })
      } catch (error) {
        await db.exec('ROLLBACK')
        throw error
      }
    }

    // 通常のインポート処理
    const tableInfo = await db.all(`PRAGMA table_info(${tableName})`)
    const primaryKeys = tableInfo
      .filter((col: any) => col.pk === 1)
      .map((col: any) => col.name)

    // トランザクション開始
    await db.exec('BEGIN TRANSACTION')

    try {
      let insertedCount = 0
      let updatedCount = 0
      let skippedCount = 0

      for (const row of data) {
        if (row.length !== headers.length) {
          skippedCount++
          continue
        }

        // 重複を許さない場合の処理
        if (options.noDuplicates) {
          const keyValues = primaryKeys.map(key => {
            const index = headers.indexOf(key)
            return index !== -1 ? row[index] : null
          })

          if (keyValues.every(val => val !== null)) {
            // 既存のレコードをチェック
            const whereClause = primaryKeys
              .map((key, i) => `${key} = ?`)
              .join(' AND ')
            const existingRecord = await db.get(
              `SELECT * FROM ${tableName} WHERE ${whereClause}`,
              keyValues
            )

            if (existingRecord) {
              skippedCount++
              continue
            }
          }
        }

        // 主キーが存在する場合、UPSERTを使用
        if (primaryKeys.length > 0) {
          const keyValues = primaryKeys.map(key => {
            const index = headers.indexOf(key)
            return index !== -1 ? row[index] : null
          })

          // 主キーの値が全て存在する場合のみ処理
          if (keyValues.every(val => val !== null)) {
            const setClause = headers
              .filter(header => !primaryKeys.includes(header))
              .map(header => `${header} = excluded.${header}`)
              .join(', ')

            const sql = `
              INSERT INTO ${tableName} (${headers.join(',')})
              VALUES (${headers.map(() => '?').join(',')})
              ON CONFLICT (${primaryKeys.join(',')})
              DO UPDATE SET ${setClause}
            `

            try {
              await db.run(sql, row)
              updatedCount++
            } catch (error) {
              console.error('行の更新エラー:', error)
              skippedCount++
            }
          } else {
            skippedCount++
          }
        } else {
          // 主キーがない場合は通常のINSERT
          try {
            const placeholders = headers.map(() => '?').join(',')
            const sql = `INSERT INTO ${tableName} (${headers.join(',')}) VALUES (${placeholders})`
            await db.run(sql, row)
            insertedCount++
          } catch (error) {
            console.error('行の挿入エラー:', error)
            skippedCount++
          }
        }
      }

      await db.exec('COMMIT')
      return NextResponse.json({
        message: "CSVデータのインポートが完了しました",
        stats: {
          inserted: insertedCount,
          updated: updatedCount,
          skipped: skippedCount
        }
      })
    } catch (error) {
      await db.exec('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error("CSVインポートエラー:", error)
    return NextResponse.json(
      { error: "CSVのインポートに失敗しました" },
      { status: 500 }
    )
  }
} 