import { NextResponse } from "next/server"
import { getDbConnection } from "@/lib/db_utils"
import path from "path"
import fs from "fs"

export async function POST(request: Request) {
  try {
    const { databaseName } = await request.json()

    if (!databaseName || typeof databaseName !== "string") {
      return NextResponse.json(
        { error: "データベース名が無効です" },
        { status: 400 }
      )
    }

    // データベース名のバリデーション
    if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
      return NextResponse.json(
        { error: "データベース名は英数字とアンダースコアのみ使用可能です" },
        { status: 400 }
      )
    }

    // データベースファイルのパスを設定
    const dbPath = path.join(process.cwd(), "data", `${databaseName}.db`)

    // データベースファイルが既に存在するかチェック
    if (fs.existsSync(dbPath)) {
      return NextResponse.json(
        { error: "指定された名前のデータベースは既に存在します" },
        { status: 400 }
      )
    }

    // データディレクトリが存在しない場合は作成
    const dataDir = path.join(process.cwd(), "data")
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // 新しいデータベースを作成
    const db = await getDbConnection(databaseName)
    
    // データベース接続を閉じる
    await db.close()

    return NextResponse.json(
      { message: "データベースが正常に作成されました" },
      { status: 201 }
    )
  } catch (error) {
    console.error("データベース作成エラー:", error)
    return NextResponse.json(
      { error: "データベースの作成に失敗しました" },
      { status: 500 }
    )
  }
} 