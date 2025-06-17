import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { projectcode: string } }) {
  try {
    const { B_ID } = await request.json();
    if (!B_ID) {
      return NextResponse.json({ error: "B_ID is required" }, { status: 400 });
    }
    // project_id取得
    const project_id = params.projectcode;
    // 重複チェック（任意）
    const exists = await db.get(
      "SELECT 1 FROM project_setubi_ID WHERE project_id = ? AND B_ID = ?",
      [project_id, B_ID]
    );
    if (exists) {
      return NextResponse.json({ error: "Already exists" }, { status: 409 });
    }
    // 追加
    await db.run(
      "INSERT INTO project_setubi_ID (project_id, B_ID) VALUES (?, ?)",
      [project_id, B_ID]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}

// GET: project_idに紐づくB_IDリストとprant_B_id情報を返す
export async function GET(request: Request, { params }: { params: { projectcode: string } }) {
  try {
    const project_id = params.projectcode;
    console.log('project_id:', project_id);
    // project_setubi_IDからB_IDリスト取得
    const bIds = await db.all(
      "SELECT B_ID FROM project_setubi_ID WHERE project_id = ?",
      [project_id]
    );
    console.log('bIds:', bIds);
    if (!bIds || bIds.length === 0) {
      return NextResponse.json([]);
    }
    // prant_B_idから詳細情報取得
    const placeholders = bIds.map(() => '?').join(',');
    const bIdValues = bIds.map(row => row.B_id);
    console.log('bIdValues:', bIdValues);
    const details = await db.all(
      `SELECT * FROM prant_B_id WHERE B_ID IN (${placeholders})`,
      bIdValues
    );
    console.log('details:', details);
    return NextResponse.json(details);
  } catch (e) {
    console.error('API error:', e);
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { projectcode: string } }) {
  try {
    const { B_id } = await request.json();
    if (!B_id) {
      return NextResponse.json({ error: "B_id is required" }, { status: 400 });
    }
    const project_id = params.projectcode;
    await db.run(
      "DELETE FROM project_setubi_ID WHERE project_id = ? AND B_ID = ?",
      [project_id, B_id]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "DB error", detail: String(e) }, { status: 500 });
  }
}
