import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"

// Database connection helper
export async function openDb() {
  return open({
    filename: "data/achievements.db",
    driver: sqlite3.Database,
  })
}

// Get all projects
export async function getProjects() {
  const db = await openDb()
  return db.all("SELECT * FROM projects ORDER BY projectNumber DESC")
}

// Get project by projectNumber
export async function getProjectByNumber(projectNumber: string) {
  const db = await openDb()
  return db.get("SELECT * FROM projects WHERE projectNumber = ?", [projectNumber])
}

// Get projects by department
export async function getProjectsByDepartment(department: string): Promise<Project[]> {
  try {
    const db = await openDb()
    const normalizedDepartment = normalizeDepartmentName(department)
    const bumonList = await getBumonList()

    const projects = await executeQuery<Project>(
      db,
      `SELECT * FROM projects WHERE department = ?`,
      [normalizedDepartment]
    )

    if (projects.length === 0) {
      return []
    }

    return projects
  } catch (error) {
    throw new Error(`部署のプロジェクト取得エラー: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Get departments
export async function getDepartments() {
  const db = await openDb()
  return db.all("SELECT * FROM bumon ORDER BY bumon_id")
}

// Get current user ID
export async function getCurrentUserId() {
  const db = await openDb()
  const result = await db.get('SELECT value FROM app_settings WHERE key = "Now_userID"')
  return result?.value ? parseInt(result.value) : null
}

// Get user by ID
export async function getUserById(id: string) {
  const db = await openDb()
  // ユーザーIDから部門情報を取得
  const bumonMember = await db.get(
    `SELECT bmh.*, b.* 
     FROM bumon_member_history bmh
     JOIN bumon b ON bmh.bumon_id = b.bumon_id
     WHERE bmh.user_id = ? 
     AND (bmh.end_date IS NULL OR bmh.end_date > date('now'))
     ORDER BY bmh.start_date DESC
     LIMIT 1`,
    [id],
  )
  return bumonMember
}

// Get project members
export async function getProjectMembers(projectId: string): Promise<string[]> {
  try {
    const db = await openDb()
    const tableExists = await executeQuery(
      db,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='project_members'`
    )

    if (tableExists.length === 0) {
      return []
    }

    const members = await executeQuery<{ employeeNumber: string }>(
      db,
      `SELECT employeeNumber FROM project_members WHERE projectId = ?`,
      [projectId]
    )

    return members.map(m => m.employeeNumber)
  } catch (error) {
    throw new Error(`プロジェクトメンバー取得エラー: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Check if user is member of project
export async function isProjectMember(projectId: string, employeeNumber: string): Promise<boolean> {
  try {
    const db = await openDb()
    const result = await executeQuery(
      db,
      `SELECT 1 FROM project_members WHERE projectId = ? AND employeeNumber = ?`,
      [projectId, employeeNumber]
    )
    return result.length > 0
  } catch (error) {
    throw new Error(`プロジェクトメンバー確認エラー: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Add user to project
export async function addProjectMember(projectId: string, employeeNumber: string): Promise<void> {
  try {
    const db = await openDb()
    const isMember = await isProjectMember(projectId, employeeNumber)

    if (isMember) {
      return
    }

    await executeUpdate(
      db,
      `INSERT INTO project_members (projectId, employeeNumber) VALUES (?, ?)`,
      [projectId, employeeNumber]
    )
  } catch (error) {
    throw new Error(`プロジェクトメンバー追加エラー: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Remove user from project
export async function removeProjectMember(projectId: string, employeeNumber: string): Promise<void> {
  try {
    const db = await openDb()
    await executeUpdate(
      db,
      `DELETE FROM project_members WHERE projectId = ? AND employeeNumber = ?`,
      [projectId, employeeNumber]
    )
  } catch (error) {
    throw new Error(`プロジェクトメンバー削除エラー: ${error instanceof Error ? error.message : String(error)}`)
  }
}
