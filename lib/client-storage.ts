/** * クライアント側のストレージユーティリティ
 * 週データをlocalStorageに保存・取得する関数群
 */

import { EventItem } from './event';

/**
 * 週データを localStorage に保存する
 */
export function saveWeekDataToStorage(
  year: number,
  week: number,
  data: any[]
) {
  try {
    localStorage.setItem(`week_data_${year}_${week}`,
      JSON.stringify(data));
  } catch (error) {
    console.error("週データの保存中にエラーが発生しました:", error);
  }
}

/**
 * localStorage から週データを取得する
 */
export function getWeekDataFromStorage(
  year: number,
  week: number
): any[] | null {
  try {
    const data = localStorage.getItem(`week_data_${year}_${week}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("週データの取得中にエラーが発生しました:", error);
    return null;
  }
}

/**
 * 週データが「変更されたか」を示すフラグを設定する
 */
export function setWeekDataChanged(
  year: number,
  week: number,
  changed: boolean
) {
  try {
    localStorage.setItem(
      `week_changed_${year}_${week}`,
      changed ? "true" : "false"
    );
  } catch (error) {
    console.error("週データの変更フラグ設定中にエラーが発生しました:", error);
  }
}

/*** 変更フラグを取得する ***/
export function hasWeekDataChanged(
  year: number,
  week: number
): boolean {
  try {
    return localStorage.getItem(`week_changed_${year}_${week}`) === "true";
  } catch (error) {
    console.error(
      "週データの変更フラグ取得中にエラーが発生しました:",
      error
    );
    return false;
  }
}

/**
 * 週データとフラグを両方クリア（削除）する
 */
export function clearWeekData(year: number, week: number) {
  try {
    localStorage.removeItem(`week_data_${year}_${week}`);
    localStorage.removeItem(`week_changed_${year}_${week}`);
  } catch (error) {
    console.error("週データのクリア中にエラーが発生しました:", error);
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
