/** * クライアント側のストレージユーティリティ
 * 週データをlocalStorageに保存・取得する関数群
 */

// 週データを保存・取得するときに使うキーを返す
const getWeekStorageKey = (year: number, week: number) =>
  `week_data_${year}_${week}`;

// 変更フラグ用のキーを返す
const getWeekChangedFlagKey = (year: number, week: number) =>
  `week_changed_${year}_${week}`;

// イベントの型定義を追加
interface EventItem {
  keyID: string;
  employeeNumber: string;
  startDateTime: string;
  endDateTime: string;
  subject: string;
  content?: string;
  type?: string;
  projectNumber?: string;
  position?: string;
  facility?: string;
  status?: string;
  businessCode?: string;
  departmentCode?: string;
  weekCode?: string;
  classification1?: string;
  classification2?: string;
  classification3?: string;
  classification4?: string;
  classification5?: string;
  classification6?: string;
  classification7?: string;
  classification8?: string;
  classification9?: string;
}

/**
 * 週データを localStorage に保存する
 */
export async function saveWeekDataToStorage(year: number, week: number, data: any[]): Promise<void> {
  try {
    const key = `week_${year}_${week}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    throw error;
  }
}

/**
 * localStorage から週データを取得する
 */
export async function getWeekDataFromStorage(year: number, week: number): Promise<any[]> {
  try {
    const key = `week_${year}_${week}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    throw error;
  }
}

/**
 * 週データが「変更されたか」を示すフラグを設定する
 */
export async function setWeekDataChanged(year: number, week: number, changed: boolean): Promise<void> {
  try {
    const key = `week_${year}_${week}_changed`;
    localStorage.setItem(key, JSON.stringify(changed));
  } catch (error) {
    throw error;
  }
}

/*** 変更フラグを取得する ***/
export async function hasWeekDataChanged(year: number, week: number): Promise<boolean> {
  try {
    const key = `week_${year}_${week}_changed`;
    const changed = localStorage.getItem(key);
    return changed ? JSON.parse(changed) : false;
  } catch (error) {
    throw error;
  }
}

/**
 * 週データとフラグを両方クリア（削除）する
 */
export async function clearWeekData(year: number, week: number): Promise<void> {
  try {
    const dataKey = `week_${year}_${week}`;
    const changedKey = `week_${year}_${week}_changed`;
    localStorage.removeItem(dataKey);
    localStorage.removeItem(changedKey);
  } catch (error) {
    throw error;
  }
}

/**
 * サーバーから来たイベントデータを
 * クライアントで表示しやすい形に変換する
 */
export function formatEventForClient(item: EventItem) {
  const startTime = new Date(item.startDateTime);
  const endTime = new Date(item.endDateTime);

  const startHour = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHour = endTime.getHours();
  const endMinutes = endTime.getMinutes();
  const duration = (endHour - startHour) * 60 + (endMinutes - startMinutes);

  const top = startHour * 64 + (startMinutes / 60) * 64;
  const height = (duration / 60) * 64;

  const colors: Record<string, string> = {
    会議: "#3788d8",
    営業: "#e67c73",
    研修: "#8e24aa",
    開発: "#43a047",
    報告: "#f6bf26",
  };

  return {
    id: item.keyID,
    keyID: item.keyID,
    title: item.subject,
    startDateTime: item.startDateTime,
    endDateTime: item.endDateTime,
    description: item.content || "",
    project: item.projectNumber || "",
    category: item.type || "",
    color: colors[item.type || ""] || "#3788d8",
    employeeNumber: item.employeeNumber,
    top,
    height,
    businessCode: item.businessCode || item.classification5 || "",
    departmentCode: item.departmentCode || "",
    classification1: item.classification1,
    classification2: item.classification2,
    classification3: item.classification3,
    classification4: item.classification4,
    classification5: item.classification5,
    classification6: item.classification6,
    classification7: item.classification7,
    classification8: item.classification8,
    classification9: item.classification9,
    equipmentNumber: item.departmentCode || "",
  };
}

/**
 * クライアント側のイベントを
 * サーバー保存用のフォーマットに変換する
 */
export function formatEventForServer(event: any) {
  // employeeNumberが設定されていない場合はエラーを投げる
  if (!event.employeeNumber) {
    console.error("イベントに社員番号が設定されていません:", event);
    throw new Error("イベントに社員番号が設定されていません");
  }

  const result: EventItem = {
    keyID: event.keyID || event.id,
    employeeNumber: event.employeeNumber,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    subject: event.title,
    content: event.description,
    type: event.category,
    projectNumber: event.project,
    position: event.position || "",
    facility: event.facility || "",
    status: event.status || "計画中",
    businessCode: event.businessCode || event.activityCode || "",
    departmentCode: event.departmentCode || event.equipmentNumber || "",
    weekCode:
      event.weekCode ||
      `W${Math.floor((new Date(event.startDateTime).getDate() - 1) / 7) + 1}`,
    classification5:
      event.classification5 || event.businessCode || event.activityCode || "",
    classification6: event.activityRow || event.classification6 || "",
    classification7: event.activityColumn || event.classification7 || "",
    classification8: event.activitySubcode || event.classification8 || "",
    classification9: event.classification9 || "",
  };

  return result;
}

export async function validateEvent(event: any): Promise<boolean> {
  if (!event.employeeNumber) {
    throw new Error('イベントに社員番号が設定されていません');
  }
  return true;
}
