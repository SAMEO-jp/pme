import { useState, useEffect } from 'react';
import { BOMType, BOMFilter } from '@bom/types/bom';
import { fetchBOMData } from '@bom/libs/api/bom';

export function useBOMData(filter: BOMFilter) {
  const [data, setData] = useState<BOMType>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchBOMData(filter);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filter]);

  return { data, loading, error };
} 