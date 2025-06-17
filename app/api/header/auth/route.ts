import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// ユーザー情報の型定義
interface User {
  user_id: string
  name_japanese: string
  name_yomi: string
  company: string
  bumon: string
  sitsu: string
  ka: string
}

// データベース接続を取得
const getDatabase = async () => {
  const dbPath = path.join(process.cwd(), 'data', 'achievements.db')
  return await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// ユーザー検索API
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const userId = searchParams.get('userId')

    // ユーザーIDが指定されている場合は、そのユーザーの情報のみを返す
    if (userId) {
      const db = await getDatabase()
      const user = await db.get<User>(
        `SELECT user_id, name_japanese, name_yomi, company, bumon, sitsu, ka
         FROM all_user
         WHERE user_id = ?`,
        [userId]
      )
      await db.close()

      if (!user) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        )
      }

      return NextResponse.json({ user })
    }

    // 検索クエリが指定されている場合は、名前で検索
    if (query) {
      const db = await getDatabase()
      const users = await db.all<User[]>(
        `SELECT user_id, name_japanese, name_yomi, company, bumon, sitsu, ka
         FROM all_user
         WHERE name_japanese LIKE ? OR name_yomi LIKE ?
         ORDER BY name_yomi
         LIMIT 10`,
        [`%${query}%`, `%${query}%`]
      )
      await db.close()

      return NextResponse.json({ users })
    }

    return NextResponse.json(
      { error: '検索クエリまたはユーザーIDを指定してください' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in user search:', error)
    return NextResponse.json(
      { error: 'ユーザー検索中にエラーが発生しました' },
      { status: 500 }
    )
  }
}
