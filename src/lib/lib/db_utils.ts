import sqlite3 from "sqlite3"
import { open } from "sqlite"
import path from "path"
import fs from "fs"

// データベースファイルのパス
const DB_PATH = path.join(process.cwd(), "data", "achievements.db")

/**
 * データベース接続を取得する関数
 * @param dbName オプション：データベース名（デフォルトはachievements.db）
 * @returns SQLiteデータベース接続
 */
export async function getDbConnection(dbName?: string) {
  // データディレクトリが存在しない場合は作成
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // データベースファイルのパスを設定
  const dbPath = dbName 
    ? path.join(process.cwd(), "data", `${dbName}.db`)
    : path.join(process.cwd(), "data", "achievements.db")

  // データベースに接続
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // 外部キー制約を有効化
  await db.run("PRAGMA foreign_keys = ON")
  return db
}

/**
 * トランザクションを使用してデータベース操作を行う関数
 * @param callback トランザクション内で実行するコールバック関数
 * @returns コールバック関数の戻り値
 */
export async function withTransaction<T>(callback: (db: any) => Promise<T>): Promise<T> {
  const db = await getDbConnection()

  try {
    // トランザクション開始
    await db.run("BEGIN TRANSACTION")

    // コールバック関数を実行
    const result = await callback(db)

    // トランザクションをコミット
    await db.run("COMMIT")

    return result
  } catch (error) {
    // エラーが発生した場合はロールバック
    await db.run("ROLLBACK")
    throw error
  } finally {
    // データベース接続を閉じる
    await db.close()
  }
}


/**
 * 従業員データを取得する関数
 * @returns 従業員データの配列
 */
export async function getEmployees() {
  const db = await getDbConnection()
  try {
    return await db.all("SELECT * FROM employees ORDER BY employeeNumber")
  } finally {
    await db.close()
  }
}

/**
 * プロジェクトデータを取得する関数
 * @returns プロジェクトデータの配列
 */
export async function getProjects() {
  const db = await getDbConnection()
  try {
    return await db.all("SELECT * FROM projects ORDER BY projectNumber")
  } finally {
    await db.close()
  }
}

/**
 * 活動タイプデータを取得する関数
 * @param dbName オプション：データベース名
 * @returns 活動タイプデータの配列
 */
export async function getActivityTypes(dbName?: string) {
  const db = await getDbConnection(dbName)
  try {
    return await db.all("SELECT * FROM m_activity_types ORDER BY displayOrder, typeCode")
  } finally {
    await db.close()
  }
}

/**
 * 現在のユーザーIDを取得する関数
 * @returns 現在のユーザーID（文字列）またはnull
 */
export async function getCurrentUserId(): Promise<string | null> {
  const db = await getDbConnection()
  try {
    const setting = await db.get("SELECT value FROM app_settings WHERE key = 'Now_userID'")
    return setting ? setting.value : null
  } finally {
    await db.close()
  }
}

/**
 * 現在のユーザー情報を取得する関数
 * @returns ユーザー情報
 */
export async function getCurrentUser() {
  const userId = await getCurrentUserId()
  const db = await getDbConnection()
  try {
    const user = await db.get("SELECT * FROM employees WHERE employeeNumber = ?", [userId])
    return user || null
  } finally {
    await db.close()
  }
}

/**
 * 現在のユーザーIDを設定する関数
 * @param userId 設定するユーザーID
 * @returns 設定が成功したかどうか
 */
export async function setCurrentUserId(userId) {
  const db = await getDbConnection()
  try {
    await db.run("INSERT OR REPLACE INTO app_settings (key, value, description) VALUES (?, ?, ?)", [
      "Now_userID",
      userId,
      "現在ログイン中のユーザーID",
    ])
    return true
  } catch (error) {
    return false
  } finally {
    await db.close()
  }
}

/**
 * 特定の年月の実績データを取得する関数
 * @param year 年
 * @param month 月
 * @returns 実績データの配列
 */
export async function getAchievementsByMonth(year, month) {
  const db = await getDbConnection()
  try {
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01 00:00:00`
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const endDate = `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01 00:00:00`

    return await db.all(
      "SELECT * FROM main_Zisseki WHERE startDateTime >= ? AND startDateTime < ? ORDER BY startDateTime",
      [startDate, endDate],
    )
  } finally {
    await db.close()
  }
}

/**
 * 特定の年と週の実績データを取得する関数
 * @param year 年
 * @param week 週番号
 * @returns 実績データの配列
 */
export async function getAchievementsByWeek(year, week) {
  const db = await getDbConnection()
  try {
    const { startDate, endDate } = getWeekDates(year, week)
    const startDateStr = formatDate(startDate) + " 00:00:00"
    const endDateStr = formatDate(new Date(endDate.getTime() + 86400000)) + " 00:00:00"

    // 現在のユーザーIDを取得
    const currentUserId = await getCurrentUserId()

    // 取得するデータのフィールドを明示的に指定
    const results = await db.all(
      `SELECT 
        keyID, employeeNumber, startDateTime, endDateTime, subject, content, 
        type, organizer, projectNumber, position, facility, status, 
        businessCode, departmentCode, weekCode, 
        classification1, classification2, classification3, classification4, 
        classification5, classification6, classification7, classification8, classification9
      FROM main_Zisseki 
      WHERE employeeNumber = ? AND startDateTime >= ? AND startDateTime < ? 
      ORDER BY startDateTime`,
      [currentUserId, startDateStr, endDateStr],
    )

    return results
  } finally {
    await db.close()
  }
}

/**
 * 実績データを追加する関数
 * @param achievement 実績データオブジェクト
 * @returns 挿入されたデータのID
 */
export async function addAchievement(achievement) {
  const db = await getDbConnection()
  try {
    const columns = Object.keys(achievement).join(", ")
    const placeholders = Object.keys(achievement)
      .map(() => "?")
      .join(", ")
    const values = Object.values(achievement)

    const result = await db.run(`INSERT INTO main_Zisseki (${columns}) VALUES (${placeholders})`, values)

    return achievement.keyID
  } finally {
    await db.close()
  }
}

/**
 * 実績データを更新する関数
 * @param keyID 更新するデータのID
 * @param achievement 更新する実績データオブジェクト
 * @returns 更新が成功したかどうか
 */
export async function updateAchievement(keyID, achievement) {
  const db = await getDbConnection()
  try {
    const setClause = Object.keys(achievement)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = [...Object.values(achievement), keyID]

    const result = await db.run(`UPDATE main_Zisseki SET ${setClause} WHERE keyID = ?`, values)

    return result.changes > 0
  } finally {
    await db.close()
  }
}

/**
 * 実績データを削除する関数
 * @param keyID 削除するデータのID
 * @returns 削除が成功したかどうか
 */
export async function deleteAchievement(keyID) {
  const db = await getDbConnection()
  try {
    const result = await db.run("DELETE FROM main_Zisseki WHERE keyID = ?", [keyID])
    return result.changes > 0
  } finally {
    await db.close()
  }
}

/**
 * ユーザーのプロジェクトリストを取得する関数
 * @param userID ユーザーID
 * @param projectCode 特定のプロジェクトコード（オプション）
 * @returns プロジェクトの配列
 */
export async function getUserProjects(userID: string, projectCode?: string | null) {
  const db = await getDbConnection()
  try {
    // project_member_historiesテーブルからデータを取得
    let query = `
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
    `
    const params = [userID]

    // プロジェクトコードが指定されている場合は条件を追加
    if (projectCode) {
      query += " AND pmh.project_id = ?"
      params.push(projectCode)
    }

    query += " ORDER BY p.projectNumber ASC"

    const results = await db.all(query, params)
    
    // 結果が空の場合のみログを出力
    if (results.length === 0) {
      console.log('プロジェクトが見つかりませんでした。')
      console.log('SQL:', query)
      console.log('パラメータ:', params)
    }

    return results
  } catch (error) {
    console.error('プロジェクト取得中にエラーが発生しました:', error)
    throw error
  } finally {
    await db.close()
  }
}

/**
 * プロジェクトの設備番号リストを取得する関数
 * @param projectCode プロジェクトコード
 * @returns 設備番号の配列
 */
export async function getProjectEquipmentNumbers(projectCode: string) {
  const db = await getDbConnection()
  try {
    // 直接projectsテーブルから取得
    const result = await db.get("SELECT equipmentNumbers FROM projects WHERE projectNumber = ?", [projectCode])

    if (result && result.equipmentNumbers) {
      return result.equipmentNumbers.split(",").map((item: string) => item.trim())
    }
    return []
  } finally {
    await db.close()
  }
}

/**
 * プロジェクトの購入品リストを取得する関数
 * @param projectId プロジェクトID
 * @param equipmentNumber 設備番号
 * @returns 購入品の配列
 */
export async function getProjectPurchaseItems(projectId: string, equipmentNumber: string) {
  const db = await getDbConnection()
  try {
    const result = await db.all(
      "SELECT * FROM project_purchase_items WHERE project_id = ? AND equipmentNumber = ? ORDER BY sequenceNumber",
      [projectId, equipmentNumber],
    )
    return result
  } catch (error) {
    console.error('プロジェクト購入品の取得中にエラーが発生しました:', error)
    throw error
  } finally {
    await db.close()
  }
}

/**
 * ユーザープロジェクト関連を追加する関数
 * @param userID ユーザーID
 * @param projectCode プロジェクトコード
 * @param role 役割
 * @returns 挿入されたデータのID
 */
export async function addUserProject(userID: string, projectCode: string, role: string) {
  const db = await getDbConnection()
  try {
    const today = new Date().toISOString().split("T")[0]
    
    // 既存のメンバーシップをチェック
    const existingMember = await db.get(
      `SELECT * FROM project_member_histories 
       WHERE user_id = ? AND project_id = ? 
       AND (end_date IS NULL OR end_date > date('now'))`,
      [userID, projectCode]
    )
    
    if (existingMember) {
      // 既存のメンバーシップがある場合は役割のみ更新
      await db.run(
        `UPDATE project_member_histories 
         SET role = ? 
         WHERE user_id = ? AND project_id = ? AND end_date IS NULL`,
        [role, userID, projectCode]
      )
      return `${userID}_${projectCode}`
    }
    
    // 新しいメンバーシップを追加
    const result = await db.run(
      `INSERT INTO project_member_histories (user_id, project_id, start_date, role) 
       VALUES (?, ?, ?, ?)`,
      [userID, projectCode, today, role]
    )
    
    return `${userID}_${projectCode}`
  } finally {
    await db.close()
  }
}

/**
 * プロジェクト詳細を追加する関数
 * @param projectDetails プロジェクト詳細オブジェクト
 * @returns 挿入されたデータのID
 */
export async function addProjectDetails(projectDetails) {
  const db = await getDbConnection()
  try {
    // equipmentNumbersが配列の場合、カンマ区切りの文字列に変換
    if (Array.isArray(projectDetails.equipmentNumbers)) {
      projectDetails.equipmentNumbers = projectDetails.equipmentNumbers.join(",")
    }

    const columns = Object.keys(projectDetails).join(", ")
    const placeholders = Object.keys(projectDetails)
      .map(() => "?")
      .join(", ")
    const values = Object.values(projectDetails)

    // projectsテーブルに直接挿入
    await db.run(`INSERT OR REPLACE INTO projects (${columns}) VALUES (${placeholders})`, values)
    return projectDetails.projectNumber
  } finally {
    await db.close()
  }
}

/**
 * プロジェクト購入品を追加する関数
 * @param purchaseItem 購入品オブジェクト
 * @returns 挿入されたデータの複合主キー
 */
export async function addProjectPurchaseItem(purchaseItem) {
  const db = await getDbConnection()
  try {
    // 次の連番を取得
    if (!purchaseItem.sequenceNumber) {
      const nextSeq = await getNextPurchaseItemSequence(db, purchaseItem.project_id, purchaseItem.equipmentNumber)
      purchaseItem.sequenceNumber = nextSeq.toString().padStart(3, "0")
    }
    // keyIDの生成・利用は不要
    const columns = Object.keys(purchaseItem).join(", ")
    const placeholders = Object.keys(purchaseItem)
      .map(() => "?")
      .join(", ")
    const values = Object.values(purchaseItem)

    await db.run(`INSERT OR REPLACE INTO project_purchase_items (${columns}) VALUES (${placeholders})`, values)
    // 複合主キーを返す
    return {
      project_id: purchaseItem.project_id,
      equipmentNumber: purchaseItem.equipmentNumber,
      sequenceNumber: purchaseItem.sequenceNumber
    }
  } finally {
    await db.close()
  }
}

/**
 * 次の購入品連番を取得する関数
 * @param db データベース接続
 * @param projectId プロジェクトID
 * @param equipmentNumber 設備番号
 * @returns 次の連番
 */
async function getNextPurchaseItemSequence(db, projectId, equipmentNumber) {
  const result = await db.get(
    "SELECT MAX(CAST(sequenceNumber AS INTEGER)) as maxSeq FROM project_purchase_items WHERE project_id = ? AND equipmentNumber = ?",
    [projectId, equipmentNumber],
  )
  if (result && result.maxSeq !== null) {
    return result.maxSeq + 1
  }
  return 1
}

// 週の開始日と終了日を取得する関数
function getWeekDates(year, week) {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = firstDayOfYear.getDay() === 0 ? 6 : firstDayOfYear.getDay() - 1
  const firstWeekDay = new Date(year, 0, 1 + (week - 1) * 7 - daysOffset)
  const startDate = new Date(firstWeekDay)
  startDate.setDate(firstWeekDay.getDate() - firstWeekDay.getDay())
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  return { startDate, endDate }
}

// 日付をYYYY-MM-DD形式にフォーマットする関数
function formatDate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}

/**
 * テーブルのカラム情報を取得する関数
 * @param tableName テーブル名
 * @returns カラム情報の配列
 */
export async function getTableColumns(tableName: string) {
  const db = await getDbConnection()
  try {
    return await db.all(`PRAGMA table_info(${tableName})`)
  } finally {
    await db.close()
  }
}

/**
 * m_activity_typesテーブルのカラム情報を取得する関数
 * @param dbName オプション：データベース名
 * @param tableName オプション：テーブル名（デフォルトはm_activity_types）
 * @returns カラム情報の配列（名前と日本語名のマッピングを含む）
 */
export async function getActivityTypeColumns(dbName?: string, tableName: string = 'm_activity_types') {
  const db = await getDbConnection(dbName)
  try {
    const columns = await db.all(`PRAGMA table_info(${tableName})`)
    
    // カラム名と日本語表示名のマッピング
    const columnNameMap = {
      typeCode: "コード",
      typeName: "名称",
      description: "説明",
      category: "大分類",
      subCategory: "中分類",
      displayOrder: "表示順",
      color: "色",
      isActive: "状態"
    }
    
    // 表示しないシステム列やID列
    const excludedColumns = ['id', 'created_at', 'updated_at']
    
    return columns
      .filter(col => !excludedColumns.includes(col.name))
      .map(col => ({
        id: col.name,
        name: columnNameMap[col.name] || col.name,
        dataType: col.type,
        visible: Object.keys(columnNameMap).includes(col.name) // デフォルトで表示する列
      }))
  } finally {
    await db.close()
  }
}

/**
 * 活動タイプを追加する関数
 * @param activityType 追加する活動タイプデータオブジェクト
 * @param dbName オプション：データベース名
 * @returns 追加した活動タイプデータ
 */
export async function addActivityType(activityType: any, dbName?: string) {
  const db = await getDbConnection(dbName)
  try {
    const columns = Object.keys(activityType).join(", ")
    const placeholders = Object.keys(activityType)
      .map(() => "?")
      .join(", ")
    const values = Object.values(activityType)

    await db.run(`INSERT INTO m_activity_types (${columns}) VALUES (${placeholders})`, values)
    
    // 追加したデータを返す
    return activityType
  } finally {
    await db.close()
  }
}

/**
 * 活動タイプを更新する関数
 * @param typeCode 更新する活動タイプのコード
 * @param activityType 更新する活動タイプデータオブジェクト
 * @param dbName オプション：データベース名
 * @returns 更新が成功したかどうか
 */
export async function updateActivityType(typeCode: string, activityType: any, dbName?: string) {
  const db = await getDbConnection(dbName)
  try {
    // typeCodeは更新対象の特定に使用するため、更新データから除外
    const updateData = { ...activityType }
    delete updateData.typeCode
    
    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ")
    const values = [...Object.values(updateData), typeCode]

    const result = await db.run(`UPDATE m_activity_types SET ${setClause} WHERE typeCode = ?`, values)

    return result.changes > 0
  } finally {
    await db.close()
  }
}

/**
 * 活動タイプを削除する関数
 * @param typeCode 削除する活動タイプのコード
 * @param dbName オプション：データベース名
 * @returns 削除が成功したかどうか
 */
export async function deleteActivityType(typeCode: string, dbName?: string) {
  const db = await getDbConnection(dbName)
  try {
    const result = await db.run("DELETE FROM m_activity_types WHERE typeCode = ?", [typeCode])
    return result.changes > 0
  } finally {
    await db.close()
  }
}

/**
 * 特定の年月のプロジェクトコード別業務集計データを取得する関数
 * @param year 年
 * @param month 月
 * @returns プロジェクトコード別の業務集計データ
 */
export async function getProjectSummaryByMonth(year: number, month: number) {
  const db = await getDbConnection()
  try {
    const startDate = `${year}-${month.toString().padStart(2, "0")}-01 00:00:00`
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const endDate = `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01 00:00:00`

    // プロジェクトコード別の業務時間集計
    const projectSummary = await db.all(
      `
      SELECT 
        z.projectNumber, 
        p.name as projectName,
        COUNT(z.keyID) as taskCount,
        SUM((julianday(z.endDateTime) - julianday(z.startDateTime)) * 24) as totalHours,
        z.type
      FROM 
        main_Zisseki z
      LEFT JOIN
        projects p ON z.projectNumber = p.projectNumber
      WHERE 
        z.startDateTime >= ? AND 
        z.startDateTime < ?
      GROUP BY 
        z.projectNumber, z.type
      ORDER BY 
        totalHours DESC
      `,
      [startDate, endDate]
    )

    // 業務タイプ別の集計
    const typeSummary = await db.all(
      `
      SELECT 
        z.type, 
        COUNT(z.keyID) as taskCount,
        SUM((julianday(z.endDateTime) - julianday(z.startDateTime)) * 24) as totalHours
      FROM 
        main_Zisseki z
      WHERE 
        z.startDateTime >= ? AND 
        z.startDateTime < ?
      GROUP BY 
        z.type
      ORDER BY 
        totalHours DESC
      `,
      [startDate, endDate]
    )

    return {
      projectSummary,
      typeSummary
    }
  } finally {
    await db.close()
  }
}

export async function getUser(userId: string) {
  const db = await getDbConnection()
  try {
    const user = await db.get(`
      SELECT 
        user_id,
        name_japanese as name,
        syokui as position,
        bumon as department,
        sitsu as section,
        ka as team,
        mail as email,
        TEL_naisen as telNaisen,
        TEL as telGaisen,
        company,
        name_english,
        name_yomi,
        in_year,
        Kengen as authority
      FROM all_user
      WHERE user_id = ?
    `, [userId])

    return user
  } catch (error) {
    console.error("ユーザー情報の取得中にエラーが発生しました:", error)
    throw error
  }
}

export async function openDatabase(): Promise<Database> {
  try {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });
    await db.run("PRAGMA foreign_keys = ON");
    return db;
  } catch (error) {
    throw error;
  }
}

export async function closeDatabase(db: Database): Promise<void> {
  try {
    await db.close();
  } catch (error) {
    throw error;
  }
}

export async function beginTransaction(db: Database): Promise<void> {
  try {
    await db.run("BEGIN TRANSACTION");
  } catch (error) {
    throw error;
  }
}

export async function commitTransaction(db: Database): Promise<void> {
  try {
    await db.run("COMMIT");
  } catch (error) {
    throw error;
  }
}

export async function rollbackTransaction(db: Database): Promise<void> {
  try {
    await db.run("ROLLBACK");
  } catch (error) {
    throw error;
  }
}

export async function executeQuery<T>(db: Database, query: string, params: any[] = []): Promise<T[]> {
  try {
    return await db.all(query, params);
  } catch (error) {
    throw error;
  }
}

export async function executeUpdate(db: Database, query: string, params: any[] = []): Promise<RunResult> {
  try {
    return await db.run(query, params);
  } catch (error) {
    throw error;
  }
}
