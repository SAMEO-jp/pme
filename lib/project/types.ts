export interface Project {
  id: string
  code: string
  name: string
  status: string
  description?: string
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
  projectNumber: string
  clientName: string
  classification: string
  budgetGrade: string
  projectStartDate: string
  projectEndDate: string
  installationDate: string
  drawingCompletionDate: string
  equipmentCategory: string
  equipmentNumbers: string
  notes: string
  spare1: string
  spare2: string
  spare3: string
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  status: string
  leader: string
  number: number
  upstate: string
  downstate: string
  segment: string
  createday: string
  changeday: string
  startday: string
  endday: string
  businesscode: string
  spare1: string
  spare2: string
  spare3: string
  spare4: string
}

export interface ColumnVisibility {
  [key: string]: boolean
}

export interface SortConfig {
  key: string
  direction: "asc" | "desc"
}
