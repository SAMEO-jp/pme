// 社員情報の型定義
export interface Employee {
  id: string
  employeeNumber: string
  name: string
  department: string
  position: string
  email: string
  phone: string
  hireDate: string
  skills: Skill[]
  evaluations: Evaluation[]
  projects: Project[]
}

// スキル情報の型定義
export interface Skill {
  id: string
  name: string
  level: number
  category: string
  lastUpdated: string
}

// 評価情報の型定義
export interface Evaluation {
  id: string
  employeeId: string
  evaluatorId: string
  date: string
  type: string
  scores: {
    category: string
    score: number
    comment: string
  }[]
  overallScore: number
  comments: string
}

// プロジェクト情報の型定義
export interface Project {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: "planning" | "in_progress" | "completed" | "on_hold"
  members: {
    employeeId: string
    role: string
    startDate: string
    endDate: string
  }[]
}

// ダッシュボードデータの型定義
export interface DashboardData {
  totalEmployees: number
  activeProjects: number
  upcomingEvaluations: number
  skillGaps: number
}

// 最近の活動の型定義
export interface Activity {
  id: string
  type: "evaluation" | "project" | "skill" | "employee"
  title: string
  description: string
  date: string
  employeeId?: string
  projectId?: string
} 