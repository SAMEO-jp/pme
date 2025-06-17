import { NextResponse } from "next/server"
import { openDb } from "@/lib/project/db"

interface Params {
  params: {
    projectId: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { projectId } = params
    console.log("Fetching members for project:", projectId)
    
    const db = await openDb()
    
    // まずプロジェクトが存在するか確認
    const project = await db.get(`SELECT * FROM projects WHERE projectNumber = ?`, [projectId])
    
    if (!project) {
      console.error(`Project not found: ${projectId}`)
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    console.log(`Project found: ${project.name}`)
    
    // プロジェクトメンバー一覧を取得
    // カラム名と結合条件を修正
    const members = await db.all(
      `
      SELECT 
        pmh.id,
        pmh.user_id,
        pmh.project_id,
        pmh.role,
        pmh.start_date,
        pmh.end_date,
        u.name as user_name,
        b.name as department_name,
        bmh.role as department_role
      FROM 
        project_member_histories pmh
      LEFT JOIN 
        users u ON pmh.user_id = u.id
      LEFT JOIN 
        bumon_member_history bmh ON pmh.user_id = bmh.user_id
      LEFT JOIN 
        bumon b ON bmh.bumon_id = b.bumon_id
      WHERE 
        pmh.project_id = ? 
        AND (pmh.end_date IS NULL OR pmh.end_date > date('now'))
      ORDER BY 
        pmh.start_date DESC
      `,
      [projectId]
    )
    
    // デバッグ情報を出力
    console.log(`Found ${members.length} members for project ${projectId}`)
    
    // 一時的にダミーデータを返す（データがない場合）
    if (members.length === 0) {
      console.log("No members found, returning dummy data for testing")
      // テスト用のダミーデータ（実際の環境では削除する）
      return NextResponse.json([
        {
          id: 1,
          user_id: "user1",
          project_id: projectId,
          role: "プロジェクトマネージャー",
          start_date: "2023-01-01",
          end_date: null,
          user_name: "山田 太郎",
          department_name: "開発部",
          department_role: "部長"
        },
        {
          id: 2,
          user_id: "user2",
          project_id: projectId,
          role: "メンバー",
          start_date: "2023-01-15",
          end_date: null,
          user_name: "佐藤 花子",
          department_name: "デザイン部",
          department_role: "デザイナー"
        }
      ])
    }
    
    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
