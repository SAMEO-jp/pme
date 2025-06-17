/**
 * クライアントサイドからデータベースを操作するためのラッパー関数
 * 週データをlocalStorageに保存・取得する関数群
 */

import {
  getWeekDataFromStorage,
  saveWeekDataToStorage,
  setWeekDataChanged,
  hasWeekDataChanged,
  formatEventForClient,
  formatEventForServer,
} from "./client-storage"

/**
 * 特定の年月の実績データを取得する関数
 * @param year 年
 * @param month 月
 * @returns 実績データの配列
 */
export async function getAchievementsByMonth(year: number, month: number) {
  try {
    const response = await fetch(`/api/achievements/month/${year}/${month}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "データの取得に失敗しました")
    }

    return data.data
  } catch (error) {
    throw error
  }
}

/**
 * 特定の年と週の実績データを取得する関数
 * @param year 年
 * @param week 週番号
 * @param forceRefresh キャッシュを無視して再取得するかどうか
 * @returns 実績データの配列
 */
export async function getAchievementsByWeek(year: number, week: number, forceRefresh = false): Promise<AchievementEvent[]> {
  try {
    const cachedData = await getWeekAchievements(year, week);
    if (cachedData.length > 0 && !forceRefresh) {
      return cachedData;
    }

    const response = await fetch(`/api/achievements/week/${year}/${week}`);
    if (!response.ok) {
      throw new Error(`API応答エラー: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'データの取得に失敗しました');
    }

    const formattedEvents = formatEvents(data.data);
    await saveWeekAchievements(year, week, formattedEvents);
    return formattedEvents;
  } catch (error) {
    throw error;
  }
}

/**
 * 週データを一括保存する関数
 * @param year 年
 * @param week 週番号
 * @param events イベントデータの配列
 * @returns 保存が成功したかどうか
 */
export async function saveWeekAchievements(year: number, week: number, events: AchievementEvent[]): Promise<void> {
  try {
    if (events.length === 0) {
      return;
    }

    const serverEvents = events.map(event => ({
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString()
    }));

    const response = await fetch('/api/achievements/week', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year,
        week,
        events: serverEvents
      })
    });

    if (!response.ok) {
      throw new Error(`保存に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || '保存に失敗しました');
    }

    await saveWeekAchievementsToLocal(year, week, events);
  } catch (error) {
    throw error;
  }
}

/**
 * 実績データを削除する関数
 * @param keyID 削除する実績データのID
 */
export async function deleteAchievement(keyID: string) {
  try {
    if (!keyID || keyID === 'undefined' || keyID === 'null') {
      throw new Error('無効なkeyIDが指定されました');
    }

    const response = await fetch(`/api/achievements/?keyID=${encodeURIComponent(keyID)}`, {
      method: "DELETE",
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new Error(`レスポンスのJSONパースに失敗: ${parseError}`);
    }

    if (!response.ok) {
      if (response.status === 404) {
        return true;
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || "データの削除に失敗しました");
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * 従業員データを取得する関数
 * @returns 従業員データの配列
 */
export async function getEmployees() {
  try {
    const response = await fetch("/api/employees")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "データの取得に失敗しました")
    }

    return data.data
  } catch (error) {
    throw error
  }
}

/**
 * プロジェクトデータを取得する関数
 * @returns プロジェクトデータの配列
 */
export async function getProjects() {
  try {
    const response = await fetch("/api/projects")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "プロジェクトデータの取得に失敗しました")
    }

    return data.data
  } catch (error) {
    throw error
  }
}

/**
 * 現在のユーザー情報を取得する関数
 * @returns ユーザー情報
 */
export async function getCurrentUser() {
  try {
    const response = await fetch("/api/user")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "ユーザー情報の取得に失敗しました")
    }

    return {
      employeeNumber: data.data.user_id,
      name: data.data.name
    }
  } catch (error) {
    throw error
  }
}

/**
 * ユーザーIDを設定する関数
 * @param userId 設定するユーザーID
 * @returns 設定が成功したかどうか
 */
export async function setCurrentUserId(userId: string) {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    throw error
  }
}
