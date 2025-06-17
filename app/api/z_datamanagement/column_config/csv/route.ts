import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"
import { TextEncoder } from 'util'
import iconv from 'iconv-lite'

interface ImportOptions {
  noDuplicates: boolean
  createNewTable: boolean
  encoding: string
}

interface ColumnConfig {
  columnName: string
  displayName: string
  isKey: boolean
  columnType: string
}

// 利用可能なエンコーディングのリスト
export const availableEncodings = [
  { value: 'UTF-8', label: 'UTF-8' },
  { value: 'Shift_JIS', label: 'Shift-JIS' },
  { value: 'EUC-JP', label: 'EUC-JP' },
  { value: 'ISO-8859-1', label: 'ISO-8859-1 (Latin-1)' }
]

// カラム設定のCSVダウンロード
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

    // テーブルのカラム情報を取得
    const columns = await db.all(`PRAGMA table_info(${tableName})`)
    
    if (!columns || columns.length === 0) {
      return NextResponse.json(
        { error: "このテーブルのカラム情報が見つかりません" },
        { status: 404 }
      )
    }
    
    // d_culum_styleからスタイル情報を取得
    const styleData = await db.all(
      "SELECT column_name, display_name, is_key, column_type FROM d_culum_style WHERE table_name = ?",
      [tableName]
    )
    
    // カラム情報をフォーマット
    const columnConfigs = columns.map((col: any) => {
      // d_culum_styleにある場合はその情報を使用
      const styleInfo = styleData.find((style: any) => style.column_name === col.name)
      
      return {
        columnName: col.name,
        displayName: styleInfo ? styleInfo.display_name : col.name,
        isKey: styleInfo ? styleInfo.is_key === 1 : col.pk === 1,
        columnType: styleInfo ? styleInfo.column_type : col.type
      }
    })
    
    // CSVヘッダーを作成
    const headers = ['columnName', 'displayName', 'isKey', 'columnType']
    
    // CSVデータを作成
    const csvRows = [
      headers.join(','),
      ...columnConfigs.map(column => 
        headers.map(header => {
          const value = column[header as keyof ColumnConfig]
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
        'Content-Disposition': `attachment; filename="${tableName}_columns.csv"`
      }
    })
  } catch (error) {
    console.error("カラム設定CSVダウンロードエラー:", error)
    return NextResponse.json(
      { error: "カラム設定CSVのダウンロードに失敗しました" },
      { status: 500 }
    )
  }
}

// カラム設定のCSVアップロード
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
      if (options.encoding === 'UTF-8') {
        csvText = Buffer.from(arrayBuffer).toString('utf-8')
      } else {
        // iconv-liteを使用してデコード
        const buffer = Buffer.from(arrayBuffer)
        csvText = iconv.decode(buffer, options.encoding)
      }
      
      // デバッグ用：CSVの最初の部分を記録
      console.log("CSV Content (first 200 chars):", csvText.substring(0, 200))
      
    } catch (error) {
      console.error("エンコーディングエラー:", error)
      return NextResponse.json(
        { error: "指定された文字エンコーディングでファイルを読み込めませんでした" },
        { status: 400 }
      )
    }

    // CSVをパースする関数
    function parseCSVLine(text: string): string[] {
      const result: string[] = [];
      let inQuote = false;
      let currentValue = "";
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          if (inQuote && i + 1 < text.length && text[i + 1] === '"') {
            // エスケープされたダブルクォート
            currentValue += '"';
            i++;
          } else {
            // クォート開始／終了
            inQuote = !inQuote;
          }
        } else if (char === ',' && !inQuote) {
          // 値の区切り（クォート内でない場合）
          result.push(currentValue);
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      
      // 最後の値を追加
      result.push(currentValue);
      
      // 各値のトリムと引用符の除去
      return result.map(value => {
        // 値の前後のスペースを削除
        value = value.trim();
        
        // 引用符で囲まれている場合は引用符を削除
        if (value.startsWith('"') && value.endsWith('"')) {
          return value.substring(1, value.length - 1);
        }
        
        return value;
      });
    }

    const rows = csvText.split(/\r?\n/).filter(line => line.trim()).map(line => parseCSVLine(line));

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "CSVファイルの形式が不正です" },
        { status: 400 }
      )
    }

    const headers = rows[0]
    const data = rows.slice(1).filter(row => row.length === headers.length)

    // 必要なヘッダーの検証
    const requiredHeaders = ['columnName', 'displayName', 'isKey', 'columnType']
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))

    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `必要なヘッダーが不足しています: ${missingHeaders.join(', ')}` },
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
        { error: "指定されたテーブルが存在しません" },
        { status: 404 }
      )
    }

    // 既存のカラム情報を取得
    const columns = await db.all(`PRAGMA table_info(${tableName})`)
    
    // トランザクション開始
    await db.exec('BEGIN TRANSACTION')

    try {
      let insertedCount = 0
      let updatedCount = 0
      let skippedCount = 0

      // デバッグ用：パース後のデータを記録
      console.log("Parsed Headers:", headers)
      console.log("Data rows count:", data.length)
      if (data.length > 0) {
        console.log("First data row:", data[0])
      }

      // CSVデータから表示名と主キー設定を更新
      for (const row of data) {
        const columnNameIndex = headers.indexOf('columnName')
        const displayNameIndex = headers.indexOf('displayName')
        const isKeyIndex = headers.indexOf('isKey')
        const columnTypeIndex = headers.indexOf('columnType')

        const columnName = row[columnNameIndex]
        const displayName = row[displayNameIndex]
        const isKey = row[isKeyIndex].toLowerCase() === 'true'
        const columnType = row[columnTypeIndex]

        // デバッグ用：各行の処理状況を記録
        console.log(`Processing column: ${columnName}, displayName: ${displayName}, isKey: ${isKey}, type: ${columnType}`)
        
        // 空のカラム名はスキップ
        if (!columnName) {
          console.log("Skipping empty column name")
          skippedCount++
          continue
        }

        // 既存のカラムかどうか確認（大文字小文字を区別しない）
        const existingColumn = columns.find((col: any) => 
          col.name.toLowerCase() === columnName.toLowerCase()
        );
        
        // テーブルにカラムが存在しなくても表示設定を保存するために、
        // カラム存在チェックを削除し、常に処理を行うようにする
        console.log(`Processing column settings for: ${columnName}`)

        // d_culum_styleの既存レコードを確認（大文字小文字を区別しない）
        const existingStyle = await db.get(
          "SELECT * FROM d_culum_style WHERE table_name = ? AND LOWER(column_name) = LOWER(?)",
          [tableName, columnName]
        );
        
        if (existingStyle) {
          console.log(`Found existing style for column: ${columnName}, updating`)
          // 既存のスタイル設定を更新
          await db.run(
            "UPDATE d_culum_style SET display_name = ?, is_key = ?, column_type = ? WHERE table_name = ? AND LOWER(column_name) = LOWER(?)",
            [displayName, isKey ? 1 : 0, columnType, tableName, columnName]
          )
          updatedCount++
        } else {
          console.log(`No existing style for column: ${columnName}, inserting new`)
          // 新しいスタイル設定を追加
          await db.run(
            "INSERT INTO d_culum_style (table_name, column_name, display_name, is_key, column_type) VALUES (?, ?, ?, ?, ?)",
            [tableName, columnName, displayName, isKey ? 1 : 0, columnType]
          )
          insertedCount++
        }
      }

      await db.exec('COMMIT')
      
      return NextResponse.json({
        message: "カラム設定のインポートが完了しました",
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
    console.error("カラム設定CSVインポートエラー:", error)
    return NextResponse.json(
      { error: "カラム設定CSVのインポートに失敗しました" },
      { status: 500 }
    )
  }
} 