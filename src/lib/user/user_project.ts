import { db } from "@/lib/db"

export interface Project {
  id: number
  projectNumber: string
  projectCode: string
  name: string
  clientName: string
  status: string
  isProject: number
  role: string
  startDate: string
}

/**
 * ユーザーが参加しているプロジェクト一覧を取得する
 * @param userId ユーザーID
 * @returns プロジェクト一覧
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    const projects = await db.all(`
      SELECT 
        pmh.*,
        p.projectNumber,
        p.name as projectName,
        p.clientName,
        p.classification,
        p.status,
        p.isProject,
        p.projectNumber as projectCode,
        pmh.role,
        pmh.start_date as startDate
      FROM project_member_histories pmh
      INNER JOIN projects p ON pmh.project_id = p.projectNumber
      WHERE pmh.user_id = ?
      AND (pmh.end_date IS NULL OR pmh.end_date > date('now'))
      ORDER BY p.projectNumber ASC
    `, [userId])

    if (!projects || projects.length === 0) {
      return []
    }

    return projects.map(project => ({
      id: project.id,
      projectNumber: project.projectNumber,
      projectCode: project.projectCode,
      name: project.projectName,
      clientName: project.clientName,
      status: project.status,
      isProject: project.isProject,
      role: project.role,
      startDate: project.startDate
    }))
  } catch (error) {
    console.error("プロジェクト取得エラー:", error)
    throw error
  }
}

/**
 * ユーザーが参加しているプロジェクトを種類別に取得する
 * @param userId ユーザーID
 * @returns プロジェクトと間接業務の配列
 */
export async function getUserProjectsByType(userId: string): Promise<{
  projects: Project[]
  indirects: Project[]
}> {
  try {
    const allProjects = await getUserProjects(userId)
    
    return {
      projects: allProjects.filter(p => p.isProject === 1),
      indirects: allProjects.filter(p => p.isProject === 0)
    }
  } catch (error) {
    console.error("プロジェクト種類別取得エラー:", error)
    throw error
  }
}

/**
 * ユーザーがプロジェクトに参加しているか確認する
 * @param userId ユーザーID
 * @param projectId プロジェクトID
 * @returns 参加しているかどうか
 */
export async function isUserProjectMember(userId: string, projectId: string): Promise<boolean> {
  try {
    const result = await db.get(`
      SELECT 1
      FROM project_member_histories
      WHERE user_id = ?
      AND project_id = ?
      AND (end_date IS NULL OR end_date > date('now'))
    `, [userId, projectId])

    return !!result
  } catch (error) {
    console.error("プロジェクトメンバー確認エラー:", error)
    throw error
  }
}

/**
 * ユーザーをプロジェクトに追加する
 * @param userId ユーザーID
 * @param projectId プロジェクトID
 * @param role 役割
 * @returns 成功したかどうか
 */
export async function addUserToProject(
  userId: string,
  projectId: string,
  role: string = "メンバー"
): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // 既存のメンバーシップをチェック
    const existingMember = await db.get(`
      SELECT 1
      FROM project_member_histories
      WHERE user_id = ?
      AND project_id = ?
      AND (end_date IS NULL OR end_date > date('now'))
    `, [userId, projectId])

    if (existingMember) {
      // 既存のメンバーシップがある場合は役割のみ更新
      await db.run(`
        UPDATE project_member_histories
        SET role = ?
        WHERE user_id = ?
        AND project_id = ?
        AND end_date IS NULL
      `, [role, userId, projectId])
    } else {
      // 新しいメンバーシップを追加
      await db.run(`
        INSERT INTO project_member_histories (user_id, project_id, start_date, role)
        VALUES (?, ?, ?, ?)
      `, [userId, projectId, today, role])
    }

    return true
  } catch (error) {
    console.error("プロジェクトメンバー追加エラー:", error)
    throw error
  }
}

/**
 * ユーザーをプロジェクトから削除する
 * @param userId ユーザーID
 * @param projectId プロジェクトID
 * @returns 成功したかどうか
 */
export async function removeUserFromProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    await db.run(`
      UPDATE project_member_histories
      SET end_date = ?
      WHERE user_id = ?
      AND project_id = ?
      AND end_date IS NULL
    `, [today, userId, projectId])

    return true
  } catch (error) {
    console.error("プロジェクトメンバー削除エラー:", error)
    throw error
  }
}
