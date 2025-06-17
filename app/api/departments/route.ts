import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const departments = await db.all(`
      SELECT DISTINCT bu as bu, sitsu as sitsu, ka as ka
      FROM all_user
      WHERE bu IS NOT NULL
        AND sitsu IS NOT NULL
        AND ka IS NOT NULL
      ORDER BY bu, sitsu, ka
    `);

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
} 