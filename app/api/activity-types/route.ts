import { NextResponse } from "next/server"
import { getActivityTypes, addActivityType, updateActivityType, deleteActivityType } from "@/lib/db_utils"

export async function GET(request: Request) {
  try {
    // クエリパラメータからデータベース名を取得
    const { searchParams } = new URL(request.url)
    const dbName = searchParams.get('dbName')
    
    // dbNameパラメータがある場合、それを使用
    const activityTypes = await getActivityTypes(dbName || undefined)

    return NextResponse.json({
      success: true,
      data: activityTypes,
    })
  } catch (error) {
    console.error("活動タイプデータの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "活動タイプデータの取得中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    if (!data.typeCode || !data.typeName) {
      return NextResponse.json(
        { success: false, message: "コードと名称は必須です" },
        { status: 400 },
      )
    }
    
    // クエリパラメータからデータベース名を取得
    const { searchParams } = new URL(request.url)
    const dbName = searchParams.get('dbName')
    
    // dbNameパラメータがある場合、それを使用
    const result = await addActivityType(data, dbName || undefined)
    
    return NextResponse.json({
      success: true,
      message: "活動タイプが正常に追加されました",
      data: result
    })
  } catch (error) {
    console.error("活動タイプの追加中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "活動タイプの追加中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    if (!data.typeCode) {
      return NextResponse.json(
        { success: false, message: "コードは必須です" },
        { status: 400 },
      )
    }
    
    // クエリパラメータからデータベース名を取得
    const { searchParams } = new URL(request.url)
    const dbName = searchParams.get('dbName')
    
    // dbNameパラメータがある場合、それを使用
    const result = await updateActivityType(data.typeCode, data, dbName || undefined)
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: "指定された活動タイプが見つかりません" },
        { status: 404 },
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "活動タイプが正常に更新されました"
    })
  } catch (error) {
    console.error("活動タイプの更新中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "活動タイプの更新中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const typeCode = searchParams.get('typeCode')
    const dbName = searchParams.get('dbName')
    
    if (!typeCode) {
      return NextResponse.json(
        { success: false, message: "typeCodeは必須です" },
        { status: 400 },
      )
    }
    
    // dbNameパラメータがある場合、それを使用
    const result = await deleteActivityType(typeCode, dbName || undefined)
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: "指定された活動タイプが見つかりません" },
        { status: 404 },
      )
    }
    
    return NextResponse.json({
      success: true,
      message: "活動タイプが正常に削除されました"
    })
  } catch (error) {
    console.error("活動タイプの削除中にエラーが発生しました:", error)
    return NextResponse.json(
      { success: false, message: "活動タイプの削除中にエラーが発生しました", error: String(error) },
      { status: 500 },
    )
  }
}
