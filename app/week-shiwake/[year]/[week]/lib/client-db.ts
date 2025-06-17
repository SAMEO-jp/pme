/**
 * クライアントサイドからデータベースを操作するためのラッパー関数
 * 週データをlocalStorageに保存・取得する関数群
 */
import { EventItem } from '../types/event';

/**
 * 週データを localStorage に保存する
 */
export function saveWeekDataToStorage(
  year: number,
  week: number,
  data: any[]) 
{ 
  try { localStorage.setItem(`week_data_${year}_${week}`,JSON.stringify(data));} 
  catch (error) {console.error("週データの保存中にエラーが発生しました:", error);  }
}

/*** localStorage から週データを取得する ***/
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



/**
 * 特定の年と週の実績データを取得する関数
 * @param year 年
 * @param week 週番号
 * @param forceRefresh キャッシュを無視して再取得するかどうか
 * @returns 実績データの配列
 */
export async function getAchievementsByWeek(year: number, week: number, forceRefresh = false) {
  try {
    console.log(`getAchievementsByWeek が呼び出されました: ${year}年 第${week}週, forceRefresh=${forceRefresh}`)

    // ローカルストレージから週データを取得
    const cachedData = getWeekDataFromStorage(year, week)

    // キャッシュデータがあり、強制更新でない場合はキャッシュを返す
    if (cachedData && !forceRefresh) {
      console.log("キャッシュから週データを取得しました", year, week, "件数:", cachedData.length)
      return cachedData
    }

    // APIから週データを取得
    console.log(`APIから週データを取得します: /api/achievements/week/${year}/${week}`)
    const response = await fetch(`/api/achievements/week/${year}/${week}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API応答エラー: ${response.status}`, errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log("API応答:", data)

    if (!data.success) {
      throw new Error(data.message || "データの取得に失敗しました")
    }

    // 取得したデータをクライアント表示用に変換
    const formattedEvents = data.data.map(formatEventForClient)
    console.log("フォーマット後のイベント数:", formattedEvents.length)

    // サンプルデータをログに出力
    if (formattedEvents.length > 0) {
      console.log("フォーマット後のサンプルイベント:", {
        id: formattedEvents[0].id,
        activityCode: formattedEvents[0].activityCode,
        businessCode: formattedEvents[0].businessCode, // businessCodeをログに追加
        departmentCode: formattedEvents[0].departmentCode, // departmentCodeをログに追加
        classification5: formattedEvents[0].classification5,
        classification6: formattedEvents[0].classification6,
        classification7: formattedEvents[0].classification7,
      })
    }

    // ローカルストレージに保存
    saveWeekDataToStorage(year, week, formattedEvents)
    setWeekDataChanged(year, week, false)

    return formattedEvents
  } catch (error) {
    console.error("実績データの取得中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 週データを一括保存する関数
 * @param year 年
 * @param week 週番号
 * @param events イベントデータの配列
 * @returns 保存が成功したかどうか
 */
export async function saveWeekAchievements(year: number, week: number, events: any[]) {
  try {
    console.log("saveWeekAchievements が呼び出されました", { year, week, eventsCount: events.length })

    // 変更がない場合は何もしない
    if (!hasWeekDataChanged(year, week)) {
      console.log("変更がないため保存をスキップします", year, week)
      return true
    }

    // イベントが空の場合は警告を表示
    if (!events || events.length === 0) {
      console.error("保存するイベントが空です！", { year, week })
      alert("保存するイベントデータが空です。操作をキャンセルします。")
      return false
    }

    // サーバー保存用にフォーマット
    const serverEvents = events.map((event) => {
      const serverEvent = formatEventForServer(event)

      // 新規イベントの場合、oldIdを設定して後でマッピングできるようにする
      if (event.id && event.id.startsWith("new-")) {
        serverEvent.oldId = event.id
      }

      return serverEvent
    })

    console.log("保存するイベント数:", serverEvents.length)
    console.log(
      "サーバーに送信するイベントのサンプル:",
      serverEvents.slice(0, 3).map((e) => ({
        keyID: e.keyID,
        classification5: e.classification5,
        activityCode: e.activityCode,
        activityRow: e.activityRow,
        activityColumn: e.activityColumn,
      })),
    )

    // APIを呼び出して週データを一括保存
    const response = await fetch(`/api/achievements/week/${year}/${week}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ events: serverEvents }),
    })

    // レスポンスのステータスコードをログに出力
    console.log("APIレスポンスステータス:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    // レスポンスのテキストをログに出力
    const responseText = await response.text()
    console.log("APIレスポンステキスト:", responseText)

    // JSONとしてパースし直す
    const data = JSON.parse(responseText)

    if (!data.success) {
      throw new Error(data.message || "データの保存に失敗しました")
    }

    console.log("保存成功:", data)

    // 保存成功後、変更フラグをリセット
    setWeekDataChanged(year, week, false)

    // 新しいIDを持つイベントがある場合、ストレージを更新
    if (data.updatedEvents && data.updatedEvents.length > 0) {
      console.log("更新されたイベント:", data.updatedEvents)
      const updatedEvents = events.map((event) => {
        const updatedEvent = data.updatedEvents.find((updated: any) => updated.oldId === event.id)

        if (updatedEvent) {
          return { ...event, id: updatedEvent.newId, unsaved: false }
        }
        return { ...event, unsaved: false }
      })

      saveWeekDataToStorage(year, week, updatedEvents)
    } else {
      // 更新IDがない場合でも、すべてのイベントの未保存フラグをリセット
      const updatedEvents = events.map((event) => ({ ...event, unsaved: false }))
      saveWeekDataToStorage(year, week, updatedEvents)
    }

    return true
  } catch (error) {
    console.error("週データの保存中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 実績データを削除する関数
 * @param keyID 削除する実績データのID
 */
export async function deleteAchievement(keyID: string) {
  try {
    console.log(`実績データを削除します: ${keyID}`);
    // キー自体が有効かチェック
    if (!keyID || keyID === 'undefined' || keyID === 'null') {
      console.error('無効なkeyIDが指定されました:', keyID);
      throw new Error('無効なkeyIDが指定されました');
    }

    const response = await fetch(`/api/achievements/?keyID=${encodeURIComponent(keyID)}`, {
      method: "DELETE",
    });

    console.log(`削除API応答ステータス: ${response.status}`);

    // レスポンスがJSONでなかった場合のエラーハンドリング
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('レスポンスのJSONパースに失敗しました:', await response.text());
      throw new Error(`レスポンスのJSONパースに失敗: ${parseError}`);
    }

    if (!response.ok) {
      // 404の場合は特別なメッセージを表示
      if (response.status === 404) {
        console.warn(`イベント ${keyID} は既に削除されているか存在しません`);
        // 404の場合でも成功として扱う（すでに存在しないため）
        return true;
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || "データの削除に失敗しました");
    }

    console.log("実績データが正常に削除されました:", keyID);
    return true;
  } catch (error) {
    console.error("実績データの削除中にエラーが発生しました:", error);
    // エラーを上位に伝播
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
    console.error("従業員データの取得中にエラーが発生しました:", error)
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
    console.error("プロジェクトデータの取得中にエラーが発生しました:", error)
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
    console.log("取得したユーザー情報:", data)

    if (!data.success) {
      throw new Error(data.message || "ユーザー情報の取得に失敗しました")
    }

    // ユーザー情報を適切な形式に変換
    return {
      employeeNumber: data.data.user_id,
      name: data.data.name
    }
  } catch (error) {
    console.error("ユーザー情報の取得中にエラーが発生しました:", error)
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
    console.error("ユーザーIDの設定中にエラーが発生しました:", error)
    throw error
  }
}
