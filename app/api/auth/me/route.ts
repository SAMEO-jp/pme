import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/db_utils"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "ユーザー情報が取得できませんでした"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error("ユーザー情報の取得中にエラーが発生しました:", error)
    return NextResponse.json({
      success: false,
      message: "ユーザー情報の取得中にエラーが発生しました"
    }, { status: 500 })
  }
} 