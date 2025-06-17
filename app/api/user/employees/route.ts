import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const employees = await db.all(`
      SELECT user_id, name_japanese
      FROM all_user
      ORDER BY name_japanese
    `)

    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: '社員情報の取得に失敗しました' },
      { status: 500 }
    )
  }
} 