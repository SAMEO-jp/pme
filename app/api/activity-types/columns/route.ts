import { NextResponse } from "next/server"
import { getActivityTypeColumns } from "@/lib/db_utils"

export async function GET(request: Request) {
  try {
    // クエリパラメータからデータベース名とテーブル名を取得
    const { searchParams } = new URL(request.url)
    const dbName = searchParams.get('dbName')
    const tableName = searchParams.get('tableName')
    
    // dbNameとtableNameパラメータがある場合、それを使用
    const columns = await getActivityTypeColumns(
      dbName || undefined, 
      tableName || undefined
    )

    return NextResponse.json({
      success: true,
      data: columns,
    })
  } catch (error) {
    console.error("活動タイプのカラム情報取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "活動タイプのカラム情報取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
} 