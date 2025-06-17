import { NextResponse } from "next/server"
import { getAchievementsByWeek, withTransaction, getCurrentUserId } from "@/lib/db_utils"
export const runtime = "nodejs"

export async function GET(
  request: Request, 
  { params }: { params: { year: string; week: string } }
) {
  try {
    console.log("週データ取得API: GET リクエスト受信")

    const year = params.year
    const week = params.week

    console.log(`週データ取得API: パラメータ - 年=${year}, 週=${week}`)

    const yearNum = Number.parseInt(year)
    const weekNum = Number.parseInt(week)

    if (isNaN(yearNum) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
      console.error(`週データ取得API: 無効なパラメータ - 年=${year}, 週=${week}`)
      return NextResponse.json({ success: false, message: "無効な年または週が指定されました" }, { status: 400 })
    }

    console.log(`週データ取得API: データベースからデータを取得中...`)
    const achievements = await getAchievementsByWeek(yearNum, weekNum)
    console.log(`週データ取得API: ${achievements.length}件のデータを取得しました`)

    // 取得したデータの一部をログに出力して確認
    if (achievements.length > 0) {
      console.log("週データ取得API: 最初のデータのサンプル:", {
        keyID: achievements[0].keyID,
        businessCode: achievements[0].businessCode, // businessCodeをログに追加
        departmentCode: achievements[0].departmentCode, // departmentCodeをログに追加
        classification5: achievements[0].classification5,
        classification6: achievements[0].classification6,
        classification7: achievements[0].classification7,
      })
    }

    return NextResponse.json({
      success: true,
      data: achievements,
    })
  } catch (error) {
    console.error("週データ取得API: エラー発生", error)
    return NextResponse.json(
      {
        success: false,
        message: "実績データの取得中にエラーが発生しました",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

// POST関数も同様に修正
export async function POST(
  request: Request, 
  { params }: { params: { year: string; week: string } }
) {
  try {
    console.log("週データ保存API: POST リクエスト受信")

    const year = params.year
    const week = params.week

    console.log(`週データ保存API: パラメータ - 年=${year}, 週=${week}`)

    const yearNum = Number.parseInt(year)
    const weekNum = Number.parseInt(week)

    if (isNaN(yearNum) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
      console.error(`週データ保存API: 無効なパラメータ - 年=${year}, 週=${week}`)
      return NextResponse.json({ success: false, message: "無効な年または週が指定されました" }, { status: 400 })
    }

    const body = await request.json()
    const events = body.events

    if (!Array.isArray(events)) {
      console.error("週データ保存API: イベントデータが配列ではありません")
      return NextResponse.json({ success: false, message: "イベントデータが正しくありません" }, { status: 400 })
    }

    // 保存前にいくつかのイベントのbusinessCodeとdepartmentCodeをログに出力
    if (events.length > 0) {
      console.log(
        "週データ保存API: 保存するイベントのサンプル:",
        events.slice(0, 3).map((e) => ({
          keyID: e.keyID,
          activityCode: e.activityCode,
          businessCode: e.businessCode, // businessCodeをログに追加
          departmentCode: e.departmentCode, // departmentCodeをログに追加
          classification5: e.classification5,
          classification6: e.classification6,
          classification7: e.classification7,
        })),
      )
    }

    console.log(`週データ保存API: ${events.length}件のイベントを保存します`)

    const updatedEvents = await withTransaction(async (db) => {
      const { startDate, endDate } = getWeekDates(yearNum, weekNum)
      const startDateStr = formatDate(startDate) + " 00:00:00"
      const endDateStr = formatDate(new Date(endDate.getTime() + 86400000)) + " 00:00:00"

      // 現在のユーザーIDを取得
      const currentUserId = await getCurrentUserId()
      console.log("週データ保存API: 現在のユーザーID:", currentUserId)

      // 現在のユーザーの週データのみを取得
      const existingEvents = await db.all(
        "SELECT keyID FROM main_Zisseki WHERE startDateTime >= ? AND startDateTime < ? AND employeeNumber = ?",
        [startDateStr, endDateStr, currentUserId],
      )

      console.log(
        "週データ保存API: クライアントから受信したイベント:",
        events.map((e) => ({
          id: e.id,
          keyID: e.keyID,
          employeeNumber: e.employeeNumber,
        })),
      )

      console.log("週データ保存API: データベースの既存イベント:", existingEvents)

      // イベントの型を定義
      type EventType = {
        keyID: string
        [key: string]: any
      }

      // 型を適用 - keyIDを優先的に使用
      const eventIds = events.filter((e: EventType) => e.keyID || e.id).map((e: EventType) => e.keyID || e.id)

      console.log("週データ保存API: クライアント側のイベントID:", eventIds)

      // 現在のユーザーのイベントのみを削除対象にする
      const idsToDelete = existingEvents
        .map((e: { keyID: string }) => e.keyID)
        .filter((id: string) => !eventIds.includes(id))

      console.log("週データ保存API: 削除対象のイベントID:", idsToDelete)
      console.log("週データ保存API: 保存対象のイベントID:", eventIds)

      if (idsToDelete.length > 0) {
        const placeholders = idsToDelete.map(() => "?").join(",")
        await db.run(`DELETE FROM main_Zisseki WHERE keyID IN (${placeholders})`, idsToDelete)
        console.log(`週データ保存API: ${idsToDelete.length}件のイベントを削除しました`)
      }

      const updatedEventIds = []

      for (const event of events) {
        // keyIDを優先的に使用
        const eventKeyID = event.keyID || event.id
        console.log("週データ保存API: 処理中のイベント:", eventKeyID, "employeeNumber:", event.employeeNumber)

        // IDが既に存在するかチェック
        const existing = await db.get("SELECT keyID FROM main_Zisseki WHERE keyID = ?", [eventKeyID])

        if (existing) {
          console.log("週データ保存API: UPDATE対象:", eventKeyID)
          console.log("週データ保存API: 更新データ:", {
            classification5: event.classification5,
            activityCode: event.activityCode,
          })

          const columns = Object.keys(event).filter((k) => k !== "keyID" && k !== "id")
          const setClause = columns.map((c) => `${c} = ?`).join(",")
          const values = [...columns.map((c) => event[c]), eventKeyID]
          await db.run(`UPDATE main_Zisseki SET ${setClause} WHERE keyID = ?`, values)
          updatedEventIds.push({ oldId: event.oldId, newId: eventKeyID })
        } else {
          console.log("週データ保存API: INSERT対象:", eventKeyID)
          // idとkeyIDの両方を除外し、keyIDのみを使用
          const filteredEvent = { ...event }
          if (filteredEvent.id) delete filteredEvent.id

          const columns = Object.keys(filteredEvent)
          const placeholders = columns.map(() => "?").join(",")
          const values = columns.map((c) => filteredEvent[c])
          await db.run(`INSERT INTO main_Zisseki (${columns.join(",")}) VALUES (${placeholders})`, values)

          if (event.oldId) {
            updatedEventIds.push({ oldId: event.oldId, newId: eventKeyID })
          }
        }
      }

      console.log(`週データ保存API: 処理完了 - ${updatedEventIds.length}件のイベントIDを更新しました`)
      return updatedEventIds
    })

    return NextResponse.json({
      success: true,
      message: "週データが正常に保存されました",
      updatedEvents: updatedEvents,
    })
  } catch (error) {
    console.error("週データ保存API: エラー発生", error)
    return NextResponse.json(
      {
        success: false,
        message: "週データの保存中にエラーが発生しました",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

// 補助関数
function getWeekDates(year: number, week: number) {
  const firstDayOfYear = new Date(year, 0, 1)
  const daysOffset = firstDayOfYear.getDay() === 0 ? 6 : firstDayOfYear.getDay() - 1
  const firstWeekDay = new Date(year, 0, 1 + (week - 1) * 7 - daysOffset)
  const startDate = new Date(firstWeekDay)
  startDate.setDate(firstWeekDay.getDate() - firstWeekDay.getDay())
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  return { startDate, endDate }
}

function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
}
