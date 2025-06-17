import { NextResponse } from "next/server"
import { openDb } from "@/lib/project/db"

interface Params {
  params: {
    projectId: string
  }
}

// ユーザーIDを名前にマッピングする関数
function getUserName(userId: string | number): string {
  // 実際のアプリケーションではデータベースから取得するか、APIを呼び出す
  const userMap: Record<string, string> = {
    "user1": "山田 太郎",
    "user2": "鈴木 一郎",
    "user3": "佐藤 花子",
    "user4": "田中 次郎",
    "user5": "高橋 三郎",
    // 他のユーザーを追加
  };

  const id = String(userId);
  return userMap[id] || `ユーザー ${id}`;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { projectId } = params
    console.log("Fetching members table data for project:", projectId)
    
    const db = await openDb()
    
    // まずプロジェクトが存在するか確認
    const project = await db.get(`SELECT * FROM projects WHERE projectNumber = ?`, [projectId])
    
    if (!project) {
      console.error(`Project not found: ${projectId}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    console.log(`Project found for table view: ${project.name}`)
    
    // project_member_historiesテーブルからプロジェクトメンバー一覧を取得
    const members = await db.all(
      `
      SELECT 
        pmh.id,
        pmh.user_id,
        pmh.project_id,
        pmh.role,
        pmh.start_date,
        pmh.end_date,
        pmh.user_id as user_name,
        b.name as department_name,
        bmh.role as department_role
      FROM 
        project_member_histories pmh
      LEFT JOIN 
        bumon_member_history bmh ON pmh.user_id = bmh.user_id
      LEFT JOIN 
        bumon b ON bmh.bumon_id = b.bumon_id
      WHERE 
        pmh.project_id = ?
      ORDER BY 
        CASE WHEN pmh.role = 'プロジェクトマネージャー' THEN 0 ELSE 1 END,
        pmh.start_date DESC
      `,
      [projectId]
    )
    
    // デバッグ情報を出力
    console.log(`Found ${members.length} members in table view for project ${projectId}`)
    
    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching project members table data:", error)
    return NextResponse.json({ error: "Failed to fetch members table data" }, { status: 500 })
  }
} 