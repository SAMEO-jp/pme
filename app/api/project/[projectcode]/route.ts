import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// プロジェクトメンバー情報の型定義
type ProjectMember = {
  id: number;
  user_id: number;
  project_id: number;
  role: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    email: string;
    company: string;
    department: string;
    position: string;
  };
};

// プロジェクトIDを取得
async function getProjectId(projectCode: string): Promise<number | null> {
  const project = await db.all(
    "SELECT id FROM projects WHERE project_code = ?",
    [projectCode]
  );
  return project && project.length > 0 ? project[0].id : null;
}

// プロジェクトメンバーを取得
async function getProjectMembers(projectId: number): Promise<ProjectMember[]> {
  const members = await db.all(
    `SELECT 
      pmh.*,                        -- メンバー履歴情報
      u.name_japanese as user_name, -- ユーザー名（日本語）
      u.mail as user_email,         -- ユーザーメール
      u.company,                    -- 会社名
      u.bumon,                      -- 部門
      u.syokui                      -- 職位
    FROM project_member_histories pmh
    JOIN all_user u ON pmh.user_id = u.user_id
    WHERE pmh.project_id = ?
    ORDER BY pmh.start_date DESC`,
    [projectId]
  );

  return members.map((member: any) => ({
    id: member.id,
    user_id: member.user_id,
    project_id: member.project_id,
    role: member.role,
    start_date: member.start_date,
    end_date: member.end_date,
    created_at: member.created_at,
    updated_at: member.updated_at,
    user: {
      name: member.user_name,
      email: member.user_email,
      company: member.company,
      department: member.bumon,
      position: member.syokui
    }
  }));
}

export async function GET(
  request: Request,
  { params }: { params: { projectcode: string } }
) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.split('/').pop();

    // プロジェクトIDを取得
    const projectId = await getProjectId(params.projectcode);
    if (!projectId) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // パスに応じて異なる処理を実行
    switch (path) {
      case 'member':
        // メンバー一覧を取得
        const members = await getProjectMembers(projectId);
        return NextResponse.json(members);

      default:
        // プロジェクト情報を取得
        const project = await db.all(
          "SELECT * FROM projects WHERE id = ?",
          [projectId]
        );
        return NextResponse.json(project[0]);
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
        projectCode: params.projectcode
      },
      { status: 500 }
    );
  }
} 