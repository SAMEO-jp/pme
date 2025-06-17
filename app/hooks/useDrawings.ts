import { useState, useEffect } from 'react';
import { Drawing } from '../types/drawing';

export const useDrawings = (projectNumber: string | null) => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectNumber) {
      setDrawings([]);
      return;
    }

    const fetchDrawings = async () => {
      setLoading(true);
      try {
        // ここで実際のAPIエンドポイントに接続する
        // 現在はモックデータを使用
        const mockDrawings: Drawing[] = [
          {
            id: '1',
            projectNumber,
            drawingNumber: 'DWG-001',
            drawingName: '設備配置図',
            revision: 'A',
            status: '承認済み',
            createdAt: '2024/04/16',
            updatedAt: '2024/04/16',
            filePath: '/drawings/dwg-001.pdf',
            notes: '初期設計図'
          },
          {
            id: '2',
            projectNumber,
            drawingNumber: 'DWG-002',
            drawingName: '配管系統図',
            revision: 'B',
            status: '審査中',
            createdAt: '2024/04/16',
            updatedAt: '2024/04/16',
            filePath: '/drawings/dwg-002.pdf',
            notes: '修正版'
          }
        ];
        setDrawings(mockDrawings);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load drawings'));
        setLoading(false);
      }
    };

    fetchDrawings();
  }, [projectNumber]);

  return { drawings, loading, error };
}; 