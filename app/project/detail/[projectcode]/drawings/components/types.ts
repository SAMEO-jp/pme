export type DrawingStatus = 'draft' | 'review' | 'in_progress' | 'approved' | 'needs_revision';

export type DrawingType = 'all' | 'plan' | 'assembly' | 'detail' | 'construction' | 'purchase' | 'memo';

export interface Drawing {
  id: number;
  drawingNumber: string;
  name: string;
  department: string;
  creator: string;
  issueDate: string;
  revision: string;
  status: DrawingStatus;
}

export interface DrawingFilters {
  type: DrawingType;
  searchQuery: string;
  page: number;
  pageSize: number;
} 