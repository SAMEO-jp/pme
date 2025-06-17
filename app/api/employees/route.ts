import { NextResponse } from "next/server"

// ダミーの従業員データ
const DUMMY_EMPLOYEES = [
  {
    employeeNumber: "E001",
    name: "山田 太郎",
    department: "開発部",
    position: "部長"
  },
  {
    employeeNumber: "E002",
    name: "鈴木 花子",
    department: "開発部",
    position: "課長"
  },
  {
    employeeNumber: "E003",
    name: "佐藤 次郎",
    department: "開発部",
    position: "主任"
  },
  {
    employeeNumber: "E004",
    name: "高橋 真理",
    department: "営業部",
    position: "部長"
  },
  {
    employeeNumber: "E005",
    name: "田中 雅人",
    department: "営業部",
    position: "課長"
  },
  {
    employeeNumber: "E006",
    name: "伊藤 健太",
    department: "総務部",
    position: "課長"
  },
  {
    employeeNumber: "E007",
    name: "渡辺 洋子",
    department: "人事部",
    position: "部長"
  },
  {
    employeeNumber: "E008",
    name: "小林 和也",
    department: "経理部",
    position: "主任"
  }
]

export async function GET() {
  try {
    // 実際のアプリケーションではデータベースからデータを取得
    
    return NextResponse.json({
      success: true,
      data: DUMMY_EMPLOYEES
    })
  } catch (error) {
    console.error("従業員データの取得中にエラーが発生しました:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "従業員データの取得に失敗しました" 
      }, 
      { status: 500 }
    )
  }
}
