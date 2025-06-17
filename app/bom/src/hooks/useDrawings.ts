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
        const response = await fetch(`/api/bom/drawings?projectNumber=${projectNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch drawings');
        }
        const data = await response.json();
        setDrawings(data);
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