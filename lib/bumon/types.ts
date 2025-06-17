// 部門情報の型定義
export interface Department {
  id?: number
  bumon_id: string // 部門ID
  name: string // 部門名
  status: string // ステータス
  leader: string // 部門責任者
  number: string // 番号
  upstate: string // 上位状態
  downstate: string // 下位状態
  segment: string // セグメント
  createday: string // 作成日
  chagedday: string // 変更日
  startday: string // 開始日
  endday: string // 終了日
  businesscode: string // ビジネスコード
  spare1: string // 予備1
  spare2: string // 予備2
  spare3: string // 予備3
  spare4: string // 予備4
  description: string // 説明
}

// 部門履歴の型定義
export interface DepartmentHistory {
  id: number
  bumon_id: string
  departmentName: string
  changeType: string
  change_date: string
  changedBy: string
}

// 部門メンバー履歴の型定義
export interface MemberHistory {
  id: number
  user_id: string
  bumon_id: string
  start_date: string
  end_date: string | null
  role: string
  desctiption: string | null
}

// プロジェクト情報の型定義
export interface Project {
  projectNumber: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: string
  clientName: string
  classification: string
  budgetGrade: string
  projectStartDate: string
  projectEndDate: string
  installationDate: string
  drawingCompletionDate: string
  equipmentCategory: string
  equipmentNumbers: string
  createdAt: string
  updatedAt: string
  notes: string
  spare1: string
  spare2: string
  spare3: string
  bumon_id?: string // 部門との関連付け用（UI表示用）
}

// プロジェクトメンバー履歴の型定義
export interface ProjectMemberHistory {
  id: number
  user_id: number
  project_id: string
  start_date: string
  end_date: string | null
  role: string
  userName?: string // UI表示用
}

// 部門メンバーの型定義
export interface Member {
  id: number
  bumon_id: string
  name: string
  position: string
  email: string
  phone: string
  joinDate: string
  status: string
}
