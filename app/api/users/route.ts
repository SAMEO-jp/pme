import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bu = searchParams.get('bu');
    const sitsu = searchParams.get('sitsu');
    const ka = searchParams.get('ka');

    if (!bu || !sitsu || !ka) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const users = await db.all(`
      SELECT 
        user_id,
        name_japanese,
        TEL,
        bu as bu,
        sitsu as sitsu,
        ka as ka
      FROM all_user
      WHERE bu = ?
        AND sitsu = ?
        AND ka = ?
      ORDER BY name_japanese
    `, [bu, sitsu, ka]);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 