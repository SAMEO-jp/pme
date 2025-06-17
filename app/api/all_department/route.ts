import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const departments = await db.all(`
      SELECT name, ver_name, start_date, end_date, department_kind, top_department
      FROM all_department
      WHERE ver_name = '2025'
    `);
    return NextResponse.json(departments);
  } catch (error) {
    console.error('all_department取得エラー:', error);
    return NextResponse.json(
      { error: 'all_departmentの取得に失敗しました' },
      { status: 500 }
    );
  }
} 