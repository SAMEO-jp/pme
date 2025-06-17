import { NextResponse } from "next/server";
import { getProjectMembers, addProjectMember } from "@project/projectmember";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { projectcode: string } }
) {
  try {
    console.log("Fetching members for project:", params.projectcode);

    // プロジェクトの存在確認
    const project = await db.all(
      "SELECT projectNumber FROM projects WHERE projectNumber = ?",
      [params.projectcode]
    );
    console.log("Project query result:", project);

    if (!project || project.length === 0) {
      console.log("Project not found");
      return NextResponse.json(
        { error: `Project not found: ${params.projectcode}` },
        { status: 404 }
      );
    }

    const members = await getProjectMembers(params.projectcode);
    console.log("Members query result:", members);

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching project members:", error);
    // エラーの詳細を返す
    return NextResponse.json(
      { 
        error: "Failed to fetch project members",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectcode: string } }
) {
  try {
    const { userId, role } = await request.json();
    console.log("Adding member to project:", { projectcode: params.projectcode, userId, role });

    if (!userId || !role) {
      return NextResponse.json(
        { error: "Missing required fields: userId, role" },
        { status: 400 }
      );
    }

    // プロジェクトの存在確認
    const project = await db.all(
      "SELECT projectNumber FROM projects WHERE projectNumber = ?",
      [params.projectcode]
    );

    if (!project || project.length === 0) {
      return NextResponse.json(
        { error: `Project not found: ${params.projectcode}` },
        { status: 404 }
      );
    }

    // メンバーを追加
    await addProjectMember(params.projectcode, userId, role);

    return NextResponse.json({ 
      success: true,
      message: "Member added successfully"
    });
  } catch (error) {
    console.error("Error adding project member:", error);
    return NextResponse.json(
      { 
        error: "Failed to add project member",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { projectcode: string } }
) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    // プロジェクトID取得
    const project = await db.all(
      "SELECT projectNumber FROM projects WHERE projectNumber = ?",
      [params.projectcode]
    );
    if (!project || project.length === 0) {
      return NextResponse.json({ error: `Project not found: ${params.projectcode}` }, { status: 404 });
    }
    // end_dateを現在時刻で更新
    await db.run(
      `UPDATE project_member_histories SET end_date = datetime('now') WHERE project_id = ? AND user_id = ? AND end_date IS NULL`,
      [params.projectcode, userId]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing project member:", error);
    return NextResponse.json({ error: "Failed to remove project member" }, { status: 500 });
  }
} 