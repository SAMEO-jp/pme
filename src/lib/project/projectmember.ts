import { db } from "@/lib/db";

// プロジェクトメンバー情報の型定義（JOINで取得されるユーザー情報も含む）
export type ProjectMember = {
  id: string;
  user_id: string;
  project_id: string;
  role: string;
  start_date: string;
  end_date: string | null;
  user: {
    name_japanese: string;
    mail: string;
    company: string;
    bumon: string;
    syokui: string;
    TEL: string;
    ka: string;
    sitsu: string;
  };
};

/**
 * 指定されたプロジェクトコードから対応するプロジェクトIDを取得する
 * @param projectCode プロジェクトの識別子
 * @returns 対応するプロジェクトID、または存在しない場合は null
 */
async function getProjectId(projectCode: string): Promise<string | null> {
  try {
    console.log("Getting project ID for:", projectCode);
    const project = await db.all(
      "SELECT projectNumber FROM projects WHERE projectNumber = ?",
      [projectCode]
    );
    console.log("Project query result:", project);
    return project && project.length > 0 ? project[0].projectNumber : null;
  } catch (error) {
    console.error("Error getting project ID:", error);
    throw error;
  }
}

/**
 * プロジェクトに所属する全メンバー履歴を取得する
 * - プロジェクトIDを取得し、それをもとに `project_member_histories` テーブルと JOIN
 * - メンバー情報とユーザー情報を統合した構造に変換して返す
 * @param projectCode プロジェクトコード
 */
export async function getProjectMembers(projectCode: string): Promise<ProjectMember[]> {
  try {
    console.log("Getting members for project:", projectCode);
    const projectId = await getProjectId(projectCode);
    console.log("Project ID:", projectId);

    if (!projectId) {
      throw new Error(`Project not found: ${projectCode}`);
    }

    const query = `
      SELECT 
        pmh.id,
        pmh.user_id,
        pmh.project_id,
        pmh.role,
        pmh.start_date,
        pmh.end_date,
        u.name_japanese,
        u.mail,
        u.company,
        u.bumon,
        u.syokui,
        u.TEL,
        u.ka,
        u.sitsu
      FROM project_member_histories pmh
      JOIN all_user u ON pmh.user_id = u.user_id
      WHERE pmh.project_id = ?
      ORDER BY pmh.start_date DESC
    `;
    console.log("Executing query:", query);
    console.log("With parameters:", [projectId]);

    const members = await db.all(query, [projectId]);
    console.log("Query result:", members);

    if (!members || members.length === 0) {
      console.log("No members found");
      return [];
    }

    // DBの結果を ProjectMember 型に変換して返す
    const result = members.map((member: any) => ({
      id: member.id,
      user_id: member.user_id,
      project_id: member.project_id,
      role: member.role,
      start_date: member.start_date,
      end_date: member.end_date,
      user: {
        name_japanese: member.name_japanese || '',
        mail: member.mail || '',
        company: member.company || '',
        bumon: member.bumon || '',
        syokui: member.syokui || '',
        TEL: member.TEL || '',
        ka: member.ka || '',
        sitsu: member.sitsu || ''
      }
    }));
    console.log("Transformed result:", result);
    return result;
  } catch (error) {
    console.error("Error fetching project members:", error);
    throw error;
  }
}

/**
 * プロジェクトに現在アサインされている「アクティブな」メンバーのみを取得する
 * - end_date が null のレコードのみを対象とする
 * @param projectCode プロジェクトコード
 */
export async function getActiveProjectMembers(projectCode: string): Promise<ProjectMember[]> {
  const allMembers = await getProjectMembers(projectCode);
  return allMembers.filter(member => !member.end_date);
}

/**
 * プロジェクトに新しいメンバーを追加する
 * - 現在日時を start_date, created_at, updated_at に自動設定する
 * @param projectCode プロジェクトコード
 * @param userId ユーザーID
 * @param role 担当役割（例: "管理者", "設計者"など）
 */
export async function addProjectMember(
  projectCode: string,
  userId: string,
  role: string
): Promise<void> {
  const projectId = await getProjectId(projectCode);
  if (!projectId) {
    throw new Error(`Project not found: ${projectCode}`);
  }

  await db.run(
    `INSERT INTO project_member_histories 
      (project_id, user_id, role, start_date)
    VALUES (?, ?, ?, datetime('now'))`,
    [projectId, userId, role]
  );
}

/**
 * 指定ユーザーをプロジェクトから「退室」させる（end_date を現在時刻に設定）
 * - 既に終了している（end_dateあり）履歴には影響しない
 * @param projectCode プロジェクトコード
 * @param userId 対象ユーザーID
 */
export async function removeProjectMember(
  projectCode: string,
  userId: number
): Promise<void> {
  const projectId = await getProjectId(projectCode);
  if (!projectId) {
    throw new Error(`Project not found: ${projectCode}`);
  }

  await db.run(
    `UPDATE project_member_histories 
    SET end_date = datetime('now'), updated_at = datetime('now')
    WHERE project_id = ? AND user_id = ? AND end_date IS NULL`,
    [projectId, userId]
  );
}
