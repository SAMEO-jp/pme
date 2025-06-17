import { getDb } from "./db"
import type { Department, DepartmentHistory, MemberHistory, Member, Project, ProjectMemberHistory } from "./types"

// 部門履歴を取得する関数
export async function getDepartmentHistory(): Promise<DepartmentHistory[]> {
  const db = await getDb()
  return db.all<DepartmentHistory[]>("SELECT * FROM bumon_history ORDER BY change_date DESC")
}

// 部門メンバー履歴を取得する関数
export async function getMemberHistory(): Promise<MemberHistory[]> {
  const db = await getDb()
  return db.all<MemberHistory[]>("SELECT * FROM bumon_member_history ORDER BY start_date DESC")
}

// 部門履歴を削除する関数
export async function deleteDepartmentHistory(id: number): Promise<void> {
  const db = await getDb()
  await db.run("DELETE FROM bumon_history WHERE id = ?", [id])
}

// 部門メンバー履歴を削除する関数
export async function deleteMemberHistory(id: number): Promise<void> {
  const db = await getDb()
  await db.run("DELETE FROM bumon_member_history WHERE id = ?", [id])
}

// 部門情報を取得する関数
export async function getDepartments(): Promise<Department[]> {
  const db = await getDb()
  return db.all<Department[]>("SELECT * FROM bumon ORDER BY name")
}

// 部門情報を登録する関数
export async function createDepartment(department: Omit<Department, "id">): Promise<{ id: number }> {
  const db = await getDb()
  const result = await db.run(
    `INSERT INTO bumon (bumon_id, name, status, leader, number, upstate, downstate, segment, createday, chagedday, startday, endday, businesscode, spare1, spare2, spare3, spare4, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      department.bumon_id,
      department.name,
      department.status,
      department.leader,
      department.number,
      department.upstate,
      department.downstate,
      department.segment,
      department.createday,
      department.chagedday,
      department.startday,
      department.endday,
      department.businesscode,
      department.spare1,
      department.spare2,
      department.spare3,
      department.spare4,
      department.description,
    ],
  )
  return { id: result.lastID }
}

// 部門情報をIDで取得する関数
export async function getDepartmentById(id: string): Promise<Department | null> {
  const db = await getDb()
  return db.get<Department>("SELECT * FROM bumon WHERE bumon_id = ?", [id])
}

// 部門情報を更新する関数
export async function updateDepartment(department: Department): Promise<void> {
  const db = await getDb()
  await db.run(
    `UPDATE bumon SET bumon_id = ?, name = ?, status = ?, leader = ?, number = ?, upstate = ?, downstate = ?, segment = ?, createday = ?, chagedday = ?, startday = ?, endday = ?, businesscode = ?, spare1 = ?, spare2 = ?, spare3 = ?, spare4 = ?, description = ? WHERE bumon_id = ?`,
    [
      department.bumon_id,
      department.name,
      department.status,
      department.leader,
      department.number,
      department.upstate,
      department.downstate,
      department.segment,
      department.createday,
      department.chagedday,
      department.startday,
      department.endday,
      department.businesscode,
      department.spare1,
      department.spare2,
      department.spare3,
      department.spare4,
      department.description,
      department.bumon_id,
    ],
  )
}

// 部門情報を削除する関数
export async function deleteDepartment(id: string): Promise<void> {
  const db = await getDb()
  await db.run("DELETE FROM bumon WHERE bumon_id = ?", [id])
}

// 部門メンバー履歴を追加する関数
export async function addMemberHistory(member: Omit<MemberHistory, "id">): Promise<{ id: number }> {
  const db = await getDb()
  try {
    const result = await db.run(
      `INSERT INTO bumon_member_history (user_id, bumon_id, start_date, end_date, role, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        member.user_id,
        member.bumon_id,
        member.start_date,
        member.end_date,
        member.role,
        member.description
      ],
    )
    return { id: result.lastID || 0 }
  } catch (error) {
    throw error
  }
}

// 特定の部門のメンバーを取得する関数
export async function getMembersByDepartment(bumon_id: string): Promise<MemberHistory[]> {
  const db = await getDb()
  try {
    const members = await db.all<MemberHistory[]>(
      `SELECT * FROM bumon_member_history WHERE bumon_id = ? ORDER BY start_date DESC`, 
      [bumon_id]
    )
    return members || []
  } catch (error) {
    return []
  }
}

// 部門参加
export async function joinDepartment(userId: string, bumon_id: string, position: string): Promise<void> {
  const db = await getDb()
  try {
    // 現在の日本時間を取得
    const now = new Date();
    now.setHours(now.getHours() + 9); // UTC+9（日本時間）
    const startDate = now.toISOString().split("T")[0] + " " + now.toISOString().split("T")[1].split(".")[0];
    
    // 既存のメンバーか確認
    const existingMember = await db.get(
      `SELECT * FROM bumon_member_history WHERE user_id = ? AND bumon_id = ? AND end_date IS NULL`,
      [userId, bumon_id]
    );
    
    if (existingMember) {
      return; // すでにメンバーなら何もしない
    }
    
    // 役職情報をroleに入れる
    await db.run(
      `INSERT INTO bumon_member_history (user_id, bumon_id, start_date, end_date, role, desctiption) 
       VALUES (?, ?, ?, NULL, ?, ?)`,
      [userId, bumon_id, startDate, position, ""]
    );
  } catch (error) {
    throw error;
  }
}

// 部門離脱
export async function leaveDepartment(userId: string, bumon_id: string): Promise<void> {
  const db = await getDb()
  try {
    // 現在の日本時間を取得
    const now = new Date();
    now.setHours(now.getHours() + 9); // UTC+9（日本時間）
    const endDate = now.toISOString().split("T")[0] + " " + now.toISOString().split("T")[1].split(".")[0];
    
    // 現在所属中のメンバーを探す
    const existingMember = await db.get(
      `SELECT * FROM bumon_member_history WHERE user_id = ? AND bumon_id = ? AND end_date IS NULL`,
      [userId, bumon_id]
    );
    
    if (!existingMember) {
      return; // メンバーでなければ何もしない
    }
    
    // メンバーの状態を更新（退出に設定）
    await db.run(
      `UPDATE bumon_member_history SET end_date = ? WHERE id = ?`,
      [endDate, existingMember.id]
    );
  } catch (error) {
    throw error;
  }
}

// 部門メンバーシップをチェック
export async function checkUserMembership(userId: string, bumon_id: string): Promise<boolean> {
  const db = await getDb()
  try {
    // 現在所属中のメンバーか確認
    const existingMember = await db.get(
      `SELECT * FROM bumon_member_history WHERE user_id = ? AND bumon_id = ? AND end_date IS NULL`,
      [userId, bumon_id]
    );
    
    return !!existingMember;
  } catch (error) {
    return false;
  }
}

// 部門のメンバー一覧を取得
export async function getDepartmentMembers(bumon_id: string): Promise<MemberHistory[]> {
  const db = await getDb()
  try {
    // 現在所属中のメンバーを取得
    const members = await db.all<MemberHistory[]>(
      `SELECT * FROM bumon_member_history WHERE bumon_id = ? AND end_date IS NULL ORDER BY start_date DESC`,
      [bumon_id]
    );
    
    return members || [];
  } catch (error) {
    return [];
  }
}

// メンバーステータスの更新
export async function updateMemberStatus(id: number, role: string, endDate: string | null): Promise<void> {
  const db = await getDb()
  await db.run(`UPDATE bumon_member_history SET role = ?, end_date = ? WHERE id = ?`, [role, endDate, id])
}

// プロジェクト情報をIDで取得する関数
export async function getProjectById(projectNumber: string): Promise<Project | null> {
  const db = await getDb()
  return db.get<Project>("SELECT * FROM projects WHERE project_number = ?", [projectNumber])
}

// プロジェクト情報を削除する関数
export async function deleteProject(projectNumber: string): Promise<void> {
  const db = await getDb()
  await db.run("DELETE FROM projects WHERE project_number = ?", [projectNumber])
}

// プロジェクトメンバー履歴を取得する関数
export async function getProjectMemberHistory(projectId: string): Promise<ProjectMemberHistory[]> {
  const db = await getDb()
  return db.all<ProjectMemberHistory[]>(
    `SELECT * FROM project_member_history WHERE project_id = ? ORDER BY start_date DESC`,
    [projectId],
  )
}

// 特定の部門に関連するプロジェクトを取得する関数
export async function getProjectsByDepartment(bumon_id: string): Promise<Project[]> {
  const db = await getDb()
  try {
    // bumon_idカラムを使用してプロジェクトを取得
    const projects = await db.all<Project[]>(
      `SELECT * FROM projects WHERE bumon_id = ? ORDER BY name`,
      [bumon_id]
    )
    return projects || []
  } catch (error) {
    return []
  }
}
