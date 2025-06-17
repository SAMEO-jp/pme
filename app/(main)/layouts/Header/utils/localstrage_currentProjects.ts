import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// プロジェクトデータの型定義
export interface Project {
  projectNumber: string
  projectName: string
  isProject: string
  // その他のプロジェクト関連情報
}

// プロジェクトメンバー履歴の型定義
interface ProjectMemberHistory {
  project_id: number
  user_id: number
  end_date: string | null
}

// ローカルストレージのキー
const STORAGE_KEYS = {
  USER_PROJECTS: 'user_projects',
  USER_INDIRECTS: 'user_indirects'
}

// データベース接続を取得
const getDatabase = async () => {
  const dbPath = path.join(process.cwd(), 'data', 'achievements.db')
  return await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

// ユーザーのプロジェクトデータを取得
export const fetchUserProjects = async (userId: string): Promise<{
  projects: Project[]
}> => {
  try {
    const db = await getDatabase()
    console.log('Database connection established')

    // まず、user_idの形式を確認
    const allUserIds = await db.all(
      `SELECT DISTINCT user_id FROM project_member_histories LIMIT 10`
    )
    console.log('Sample user_ids in database:', allUserIds)

    // プロジェクトメンバー履歴から有効なプロジェクトIDを取得
    const memberHistories = await db.all<ProjectMemberHistory[]>(
      `SELECT DISTINCT project_id, user_id, end_date
       FROM project_member_histories
       WHERE user_id = ?`,
      [userId]
    )
    console.log('Member histories found:', memberHistories)

    // end_dateがNULLまたは空文字列のものをフィルタリング
    const activeMemberHistories = memberHistories.filter(mh => mh.end_date === null || mh.end_date === '')
    console.log('Active member histories:', activeMemberHistories)

    const projectIds = activeMemberHistories.map((row: ProjectMemberHistory) => row.project_id)
    console.log('Project IDs:', projectIds)

    if (projectIds.length === 0) {
      console.log('No project IDs found for user')
      await db.close()
      return { projects: [] }
    }

    // プロジェクト情報を取得（全てのプロジェクト）
    const projects = await db.all<Project[]>(
      `SELECT *
       FROM projects
       WHERE projectNumber IN (${projectIds.map(() => '?').join(',')})`,
      projectIds
    )
    console.log('Projects found:', projects)

    await db.close()

    return { projects }
  } catch (error) {
    console.error('Error fetching user projects:', error)
    throw error
  }
}

// ローカルストレージにデータを保存
export const saveProjectsToLocalStorage = (projects: Project[], indirects: Project[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PROJECTS, JSON.stringify(projects))
    localStorage.setItem(STORAGE_KEYS.USER_INDIRECTS, JSON.stringify(indirects))
  }
}

// ローカルストレージからデータを取得
export const getProjectsFromLocalStorage = (): {
  projects: Project[],
  indirects: Project[]
} => {
  if (typeof window === 'undefined') {
    return { projects: [], indirects: [] }
  }

  const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROJECTS) || '[]')
  const indirects = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_INDIRECTS) || '[]')

  return { projects, indirects }
}

// ローカルストレージのデータをクリア
export const clearProjectsFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.USER_PROJECTS)
    localStorage.removeItem(STORAGE_KEYS.USER_INDIRECTS)
  }
} 