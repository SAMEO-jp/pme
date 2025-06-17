import { Drawing, DrawingDetail, BuzaiDetail } from '../types/drawing';

export async function fetchDrawingDetails(projectNumber: string, drawingId: string): Promise<DrawingDetail> {
  const response = await fetch(`/api/bom/drawings?projectNumber=${projectNumber}&drawingId=${drawingId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch drawing details');
  }
  return response.json();
}

export async function fetchDrawings(projectNumber: string): Promise<Drawing[]> {
  const response = await fetch(`/api/bom/drawings?projectNumber=${projectNumber}`);
  if (!response.ok) {
    throw new Error('Failed to fetch drawings');
  }
  return response.json();
}

export async function fetchBuzaiDetails(projectNumber: string, drawingId: string, partId: string): Promise<BuzaiDetail[]> {
  const res = await fetch(`/api/bom/drawings?projectNumber=${projectNumber}&drawingId=${drawingId}&partId=${partId}`);
  if (!res.ok) throw new Error('材料明細の取得に失敗しました');
  const data = await res.json();
  return data.buzaiList as BuzaiDetail[];
} 