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
export async function getProjectsByDepartment(department: string) {
  console.log("DB: Getting projects for department:", department)
  const db = await openDb()

  try {
    // プロジェクトテーブルの構造を確認
    const projectColumns = await db.all("PRAGMA table_info(projects)")
    console.log(
      "Projects table columns:",
      projectColumns.map((c) => c.name),
    )

    // bumonテーブルから部門情報を取得（表記ゆれを考慮）
    const bumonList = await db.all("SELECT * FROM bumon")
    console.log("Total bumon records:", bumonList.length)
    console.log(
      "Bumon names:",
      bumonList.map((b) => b.name),
    )

    // 部門名の表記ゆれを考慮したマッチング
    let matchedBumon = null
    for (const bumon of bumonList) {
      // 完全一致
      if (bumon.name === department) {
        matchedBumon = bumon
        console.log("DB: Exact match found for bumon:", bumon)
        break
      }

      // 部分一致（含まれる場合）
      if (bumon.name.includes(department) || department.includes(bumon.name)) {
        matchedBumon = bumon
        console.log("DB: Partial match found for bumon:", bumon)
        break
      }

      // 数字の全角/半角を無視した比較
      const normalizedBumonName = bumon.name.replace(/[０-９]/g, (m: string) => String.fromCharCode(m.charCodeAt(0) - 0xfee0))
      const normalizedDepartment = department.replace(/[０-９]/g, (m: string) => String.fromCharCode(m.charCodeAt(0) - 0xfee0))

      if (normalizedBumonName === normalizedDepartment) {
        matchedBumon = bumon
        console.log("DB: Normalized match found for bumon:", bumon)
        break
      }
    }

    if (matchedBumon) {
      console.log(`DB: Found matching bumon: ${matchedBumon.name} (${matchedBumon.bumon_id})`)
    } else {
      console.log("DB: No matching bumon found for:", department)
      // 部門が見つからない場合は空の配列を返す（全プロジェクトを返さない）
      return []
    }

    // プロジェクトテーブルの実際のデータを確認
    const sampleProjects = await db.all("SELECT * FROM projects LIMIT 5")
    console.log("Sample projects:", sampleProjects)

    // 部門関連のカラムを探す
    const possibleDepartmentColumns = [
      "classification",
      "department",
      "bumon_id",
      "bumon",
      "spare1",
      "spare2",
      "spare3",
    ]

    // 各カラムで部門名でフィルタリングを試みる
    let projects = []

    // 1. まず部門名で検索
    for (const column of possibleDepartmentColumns) {
      if (projectColumns.some((col) => col.name === column)) {
        console.log(`DB: Trying to filter by ${column} = ${department}`)
        const result = await db.all(`SELECT * FROM projects WHERE ${column} = ? ORDER BY projectNumber DESC`, [
          department,
        ])

        if (result.length > 0) {
          console.log(`DB: Found ${result.length} projects with ${column} = ${department}`)
          projects = result
          break
        }
      }
    }

    // 2. 部門名での検索で見つからない場合、部門IDで検索
    if (projects.length === 0 && matchedBumon) {
      const bumonId = matchedBumon.bumon_id
      console.log(`DB: Trying to find projects with bumon_id = ${bumonId}`)

      for (const column of possibleDepartmentColumns) {
        if (projectColumns.some((col) => col.name === column)) {
          console.log(`DB: Trying to filter by ${column} = ${bumonId}`)
          const result = await db.all(`SELECT * FROM projects WHERE ${column} = ? ORDER BY projectNumber DESC`, [
            bumonId,
          ])

          if (result.length > 0) {
            console.log(`DB: Found ${result.length} projects with ${column} = ${bumonId}`)
            projects = result
            break
          }
        }
      }
    }

    // 3. それでも見つからない場合、部分一致で検索
    if (projects.length === 0) {
      console.log("DB: Trying partial matching for department name")

      for (const column of possibleDepartmentColumns) {
        if (projectColumns.some((col) => col.name === column)) {
          console.log(`DB: Trying to filter by ${column} LIKE %${department}%`)
          const result = await db.all(`SELECT * FROM projects WHERE ${column} LIKE ? ORDER BY projectNumber DESC`, [
            `%${department}%`,
          ])

          if (result.length > 0) {
            console.log(`DB: Found ${result.length} projects with ${column} LIKE %${department}%`)
            projects = result
            break
          }
        }
      }
    }

    // 4. 最後の手段として、すべてのプロジェクトを取得して、フロントエンドでフィルタリング
    // この部分をコメントアウトして、絞り込みが機能しない原因を特定
    /*
    if (projects.length === 0) {
      console.log("DB: No projects found with department filters, returning all projects")
      projects = await db.all("SELECT * FROM projects ORDER BY projectNumber DESC")
    }
    */

    console.log(`DB: Returning ${projects.length} projects for department ${department}`)
    return projects
  } catch (error) {
    console.error("DB Error getting projects by department:", error)
    throw error
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
export async function getProjectMembers(projectId: string) {
  console.log("DB: Getting members for project:", projectId)
  const db = await openDb()
  try {
    // まずテーブルが存在するか確認
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='project_member_histories'",
    )

    if (!tableExists) {
      console.error("Table project_member_histories does not exist")
      return []
    }

    // ユーザーIDから部門情報を取得するために3つのテーブルを結合
    const members = await db.all(
      `
      SELECT pmh.*, 
             bmh.role as department_role,
             b.name as department_name,
             b.leader as department_leader
      FROM project_member_histories pmh
      LEFT JOIN bumon_member_history bmh ON pmh.user_id = bmh.user_id
      LEFT JOIN bumon b ON bmh.bumon_id = b.bumon_id
      WHERE pmh.project_id = ? 
      AND (pmh.end_date IS NULL OR pmh.end_date > date('now'))
      AND (bmh.end_date IS NULL OR bmh.end_date > date('now'))
      ORDER BY pmh.start_date DESC
    `,
      [projectId],
    )

    // ユーザー名を設定（ここでは仮にuser_idを表示）
    const membersWithNames = members.map((member) => ({
      ...member,
      user_name: `${member.user_id}${member.department_name ? ` (${member.department_name})` : ""}`,
    }))

    console.log("DB: Found members:", membersWithNames)
    return membersWithNames
  } catch (error) {
    console.error("DB Error getting project members:", error)
    throw error
  }
}

// Check if user is member of project
export async function isUserProjectMember(userId: string, projectId: string) {
  console.log("DB: Checking if user", userId, "is member of project", projectId)
  const db = await openDb()
  try {
    const member = await db.get(
      `
      SELECT * FROM project_member_histories 
      WHERE user_id = ? AND project_id = ? 
      AND (end_date IS NULL OR end_date > date('now'))
    `,
      [userId, projectId],
    )
    console.log("DB: Member check result:", !!member)
    return !!member
  } catch (error) {
    console.error("DB Error checking project membership:", error)
    throw error
  }
}

// Add user to project
export async function addUserToProject(userId: string, projectId: string, role: string): Promise<{ changes: number; message?: string }> {
  console.log("DB: Adding user", userId, "to project", projectId, "with role", role)
  const db = await openDb()
  const today = new Date().toISOString().split("T")[0]

  try {
    // テーブルが存在するか確認
    const tableExists = await db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='project_member_histories'"
    )

    if (!tableExists) {
      console.error("Error: project_member_histories table does not exist")
      return { changes: 0, message: "Error: Table project_member_histories does not exist" }
    }

    // 既に参加しているか確認
    const existingMember = await db.get(
      `
      SELECT * FROM project_member_histories 
      WHERE user_id = ? AND project_id = ? 
      AND (end_date IS NULL OR end_date > date('now'))
    `,
      [userId, projectId]
    )

    if (existingMember) {
      console.log("DB: User is already a member of this project")
      return { changes: 0, message: "Already a member" }
    }

    const result = await db.run(
      `
      INSERT INTO project_member_histories (user_id, project_id, start_date, role)
      VALUES (?, ?, ?, ?)
    `,
      [userId, projectId, today, role]
    )
    console.log("DB: Insert result:", result)
    return { changes: result.changes || 0 }
  } catch (error) {
    console.error("DB Error adding user to project:", error)
    throw error
  }
}

// Remove user from project
export async function removeUserFromProject(userId: string, projectId: string) {
  console.log("DB: Removing user", userId, "from project", projectId)
  const db = await openDb()
  const now = new Date().toISOString().split('T')[0]

  try {
    const result = await db.run(
      `UPDATE project_member_histories 
      SET end_date = ? 
       WHERE user_id = ? 
       AND project_id = ? 
       AND end_date IS NULL`,
      [now, parseInt(userId), projectId]
    )
    console.log("DB: Update result:", result)
    return result
  } catch (error) {
    console.error("DB Error removing user from project:", error)
    throw error
  } finally {
    await db.close()
  }
}
