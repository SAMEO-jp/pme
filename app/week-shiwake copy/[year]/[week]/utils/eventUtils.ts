// イベント操作関連のユーティリティ関数
import { formatDateTimeForStorage, TIME_SLOT_HEIGHT } from "./dateUtils"
import { DEFAULT_COLOR, PROJECT_COLORS, ACTIVITY_CODES } from "./constants"

// 新しいイベントを作成する関数
export function createNewEvent({
  day,
  hour,
  minute,
  employeeNumber,
  selectedTab,
  selectedProjectSubTab,
  projects,
}: {
  day: Date
  hour: number
  minute: number
  employeeNumber: string
  selectedTab: string
  selectedProjectSubTab: string
  projects: any[]
}) {
  // 新規イベントの開始時間と終了時間を設定
  const startDateTime = new Date(day)

  // 時間を正しく設定
  startDateTime.setHours(hour)
  startDateTime.setMinutes(minute)
  startDateTime.setSeconds(0)
  startDateTime.setMilliseconds(0)

  // 終了時間は開始時間の30分後に変更
  const endDateTime = new Date(startDateTime)
  endDateTime.setMinutes(startDateTime.getMinutes() + 30)

  // フロントエンド側でもemployeeNumber_YYYYMMDDHHmm形式のIDを生成
  const year = startDateTime.getFullYear()
  const month = (startDateTime.getMonth() + 1).toString().padStart(2, "0")
  const day_str = startDateTime.getDate().toString().padStart(2, "0")
  const hours = startDateTime.getHours().toString().padStart(2, "0")
  const minutes = startDateTime.getMinutes().toString().padStart(2, "0")
  const id = `${employeeNumber}_${year}${month}${day_str}${hours}${minutes}`

  // 日時を正しくフォーマット
  const startDateTimeStr = formatDateTimeForStorage(startDateTime)
  const endDateTimeStr = formatDateTimeForStorage(endDateTime)

  // 選択されているタブに基づいて初期値を設定
  const isProjectTab = selectedTab === "project"

  // プロジェクトに基づいて役割を自動設定
  const defaultPosition = isProjectTab ? "担当者" : ""

  // 開催者名を自動設定
  const defaultOrganizer = isProjectTab && selectedProjectSubTab === "会議" ? "自動設定" : ""

  // ここでタブに応じた初期の業務コードを設定
  let initialActivityCode = ""
  let initialActivityRow = ""
  let initialActivityColumn = ""
  let initialActivitySubcode = ""

  if (isProjectTab) {
    if (selectedProjectSubTab === "計画") {
      // 計画タブでのデフォルトコード
      initialActivityCode = ACTIVITY_CODES.PLAN.DEFAULT
      // サブタブの情報を使用
      if (selectedProjectSubTab === "計画") {
        initialActivityCode = ACTIVITY_CODES.PLAN.PLAN
      } else if (selectedProjectSubTab === "検討書") {
        initialActivityCode = ACTIVITY_CODES.PLAN.CONSIDERATION
      } else if (selectedProjectSubTab === "見積り") {
        initialActivityCode = ACTIVITY_CODES.PLAN.ESTIMATE
      }
    } else if (selectedProjectSubTab === "設計") {
      // 設計タブでのデフォルトコード
      initialActivityCode = ACTIVITY_CODES.DESIGN.DEFAULT
    } else if (selectedProjectSubTab === "購入品") {
      initialActivityCode = ACTIVITY_CODES.PURCHASE.DEFAULT
      initialActivityRow = ACTIVITY_CODES.PURCHASE.ROW
      initialActivityColumn = ACTIVITY_CODES.PURCHASE.COLUMN
      initialActivitySubcode = ACTIVITY_CODES.PURCHASE.SUBCODE
    }
  }

  // プロジェクトに基づいて色を決定
  let projectColor = DEFAULT_COLOR
  if (isProjectTab && projects.length > 0) {
    // プロジェクトコードの最後の数字に基づいて色を割り当て
    const projectCode = projects[0].projectNumber
    const lastDigit = projectCode.slice(-1)

    projectColor = PROJECT_COLORS[lastDigit] || DEFAULT_COLOR
  }

  return {
    id: id,
    title: isProjectTab ? `新規${selectedProjectSubTab}業務` : "新規間接業務",
    startDateTime: startDateTimeStr,
    endDateTime: endDateTimeStr,
    description: "",
    project: isProjectTab && projects.length > 0 ? projects[0].projectNumber : "",
    category: isProjectTab ? (selectedProjectSubTab === "会議" ? "会議" : "開発") : "会議",
    color: projectColor, // プロジェクトに基づいた色を使用
    employeeNumber,
    position: defaultPosition,
    facility: "",
    status: "計画中",
    organizer: defaultOrganizer,
    // タブに応じた追加フィールド
    projectPhase: isProjectTab ? selectedProjectSubTab : "",
    projectSubType: isProjectTab ? selectedProjectSubTab : "",
    indirectType: !isProjectTab ? "会議" : "",
    // 設備番号フィールド（productNumberからequipmentNumberに変更）
    equipmentNumber: "",
    // 業務分類コード関連フィールド
    activityCode: initialActivityCode,
    activityRow: initialActivityRow,
    activityColumn: initialActivityColumn,
    activitySubcode: initialActivitySubcode,
    unsaved: true, // 未保存フラグ
    // 表示用の位置情報（0時基準に変更）- 定数を使用
    top: hour * TIME_SLOT_HEIGHT + (minute / 60) * TIME_SLOT_HEIGHT,
    height: TIME_SLOT_HEIGHT / 2, // 30分の高さ（64px/2）
  }
}
