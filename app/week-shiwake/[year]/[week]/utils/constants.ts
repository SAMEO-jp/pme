// 時間関連の定数
export const TIME_SLOT_HEIGHT = 64 // 1時間の高さ（px）
export const FIFTEEN_MIN_HEIGHT = TIME_SLOT_HEIGHT / 4 // 15分の高さ（px）
export const FIFTEEN_MIN_RATIO = 15 // 15分（分単位）
export const minuteSlots = [0, 30] // 30分刻みのスロット

// プロジェクトカラー関連の定数
export const DEFAULT_COLOR = "#3788d8" // プロジェクトがない場合のデフォルト色

// プロジェクトカラーのマッピング
export const PROJECT_COLORS: Record<string, string> = {
  "0": "#2563eb", // より濃い青
  "1": "#16a34a", // より濃い緑
  "2": "#7e22ce", // より濃い紫
  "3": "#dc2626", // より濃い赤
  "4": "#ca8a04", // より濃い黄
  "5": "#0e7490", // より濃いシアン
  "6": "#ea580c", // より濃いオレンジ
  "7": "#5f3f3f", // より濃い茶
  "8": "#475569", // より濃い青灰
  "9": "#be185d", // より濃いピンク
}

// 業務コード関連の定数
export const ACTIVITY_CODES = {
  PLAN: {
    DEFAULT: "P300",
    PLAN: "P301",
    CONSIDERATION: "P302",
    ESTIMATE: "P200",
  },
  DESIGN: {
    DEFAULT: "D300",
  },
  PURCHASE: {
    DEFAULT: "P100",
    ROW: "1",
    COLUMN: "0",
    SUBCODE: "0",
  },
}

// イベントカテゴリーの色定義
export const EVENT_CATEGORY_COLORS: Record<string, string> = {
  会議: "#2563eb", // より濃い青
  営業: "#dc2626", // より濃い赤
  研修: "#7e22ce", // より濃い紫
  開発: "#16a34a", // より濃い緑
  報告: "#ca8a04", // より濃い黄
}

// 勤務時間のデフォルト設定
export const DEFAULT_WORK_TIMES = {
  START_TIMES: {
    0: "", // 日曜日
    1: "09:00", // 月曜日
    2: "09:00", // 火曜日
    3: "09:00", // 水曜日
    4: "09:00", // 木曜日
    5: "09:00", // 金曜日
    6: "", // 土曜日
  },
  END_TIMES: {
    0: "", // 日曜日
    1: "18:00", // 月曜日
    2: "18:00", // 火曜日
    3: "18:00", // 水曜日
    4: "18:00", // 木曜日
    5: "18:00", // 金曜日
    6: "", // 土曜日
  },
} 