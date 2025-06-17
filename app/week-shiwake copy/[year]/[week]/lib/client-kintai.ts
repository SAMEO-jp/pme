/**
 * 出退勤時間データ操作用のヘルパー関数
 */

import { getCurrentUser } from "./client-db"

type WorkTimeData = {
  date: string;
  startTime?: string;
  endTime?: string;
}

type KintaiData = {
  user_id: string;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  break_minutes: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 特定の日付の出退勤時間を取得する
 * @param date 日付（YYYY-MM-DD形式）
 * @returns 出退勤時間データ
 */
export async function getKintaiByDate(date: string) {
  try {
    // 現在のユーザー情報を取得
    const currentUser = await getCurrentUser()
    const userId = currentUser.employeeNumber
    
    // APIを呼び出して出退勤時間を取得
    const response = await fetch(`/api/kintai/${userId}/${date}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || "出退勤時間の取得に失敗しました")
    }
    
    // 時刻のフォーマットを変換
    const kintaiData = data.data
    const startTime = kintaiData.clock_in 
      ? kintaiData.clock_in.split(' ')[1].substring(0, 5) // "HH:MM"形式に変換
      : ""
    const endTime = kintaiData.clock_out 
      ? kintaiData.clock_out.split(' ')[1].substring(0, 5) // "HH:MM"形式に変換
      : ""
    
    return {
      date,
      startTime,
      endTime
    }
  } catch (error) {
    console.error("出退勤時間の取得中にエラーが発生しました:", error)
    // エラーの場合は空のデータを返す
    return {
      date,
      startTime: "",
      endTime: ""
    }
  }
}

/**
 * 特定の日付の出退勤時間を更新する
 * @param date 日付（YYYY-MM-DD形式）
 * @param startTime 出勤時間（HH:MM形式）
 * @param endTime 退勤時間（HH:MM形式）
 * @returns 更新が成功したかどうか
 */
export async function updateKintaiByDate(date: string, startTime: string, endTime: string) {
  try {
    // 現在のユーザー情報を取得
    const currentUser = await getCurrentUser()
    const userId = currentUser.employeeNumber
    
    // APIを呼び出して出退勤時間を更新
    const clockIn = startTime ? `${date} ${startTime}:00` : null
    const clockOut = endTime ? `${date} ${endTime}:00` : null
    
    const response = await fetch(`/api/kintai/${userId}/${date}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        clock_in: clockIn,
        clock_out: clockOut
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || "出退勤時間の更新に失敗しました")
    }
    
    return true
  } catch (error) {
    console.error("出退勤時間の更新中にエラーが発生しました:", error)
    return false
  }
}

/**
 * 特定の週の出退勤時間を取得する
 * @param year 年
 * @param week 週番号
 * @returns 出退勤時間データの配列
 */
export async function getKintaiByWeek(year: number, week: number) {
  try {
    // 現在のユーザー情報を取得
    const currentUser = await getCurrentUser()
    const userId = currentUser.employeeNumber
    
    // APIを呼び出して週の出退勤時間を取得
    const response = await fetch(`/api/kintai/week/${userId}/${year}/${week}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || "週の出退勤時間の取得に失敗しました")
    }
    
    // 時刻のフォーマットを変換
    return data.data.map((kintai: KintaiData) => ({
      date: kintai.date,
      startTime: kintai.clock_in 
        ? kintai.clock_in.split(' ')[1].substring(0, 5) // "HH:MM"形式に変換
        : "",
      endTime: kintai.clock_out 
        ? kintai.clock_out.split(' ')[1].substring(0, 5) // "HH:MM"形式に変換
        : ""
    }))
  } catch (error) {
    console.error("週の出退勤時間の取得中にエラーが発生しました:", error)
    // エラーの場合は空の配列を返す
    return []
  }
}

/**
 * 特定の週の出退勤時間を一括更新する
 * @param year 年
 * @param week 週番号
 * @param workTimes 出退勤時間データの配列
 * @returns 更新が成功したかどうか
 */
export async function updateKintaiByWeek(year: number, week: number, workTimes: WorkTimeData[]) {
  try {
    // 現在のユーザー情報を取得
    const currentUser = await getCurrentUser()
    const userId = currentUser.employeeNumber
    
    // APIを呼び出して週の出退勤時間を一括更新
    const response = await fetch(`/api/kintai/week/${userId}/${year}/${week}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        workTimes
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || "週の出退勤時間の更新に失敗しました")
    }
    
    return true
  } catch (error) {
    console.error("週の出退勤時間の更新中にエラーが発生しました:", error)
    return false
  }
} 