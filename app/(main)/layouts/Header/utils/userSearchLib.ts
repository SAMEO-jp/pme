import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { User } from './userSearch'

// データベース接続を取得
const getDatabase = async () => {
  const dbPath = path.join(process.cwd(), 'data', 'achievements.db')
  return await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// ユーザーIDによる検索
export const findUserById = async (userId: string): Promise<User | null> => {
  try {
    const db = await getDatabase()
    const user = await db.get<User>(
      `SELECT user_id, name_japanese, name_yomi, company, bumon, sitsu, ka
       FROM all_user
       WHERE user_id = ?`,
      [userId]
    )
    await db.close()

    return user || null
  } catch (error) {
    console.error('Error finding user by ID:', error)
    return null
  }
}

// 名前による検索
export const findUsersByName = async (query: string): Promise<User[]> => {
  try {
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

    return users
  } catch (error) {
    console.error('Error finding users by name:', error)
    return []
  }
}

// ユーザー情報の検証
export const validateUser = (user: User): boolean => {
  return (
    typeof user.user_id === 'string' &&
    typeof user.name_japanese === 'string' &&
    typeof user.name_yomi === 'string' &&
    typeof user.company === 'string' &&
    typeof user.bumon === 'string' &&
    typeof user.sitsu === 'string' &&
    typeof user.ka === 'string'
  )
} 