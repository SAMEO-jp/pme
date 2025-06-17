import { BOMType, BOMFilter } from '@bom/types/bom';

export async function fetchBOMData(filter: BOMFilter): Promise<BOMType> {
  try {
    const response = await fetch(`/api/bom/list?${new URLSearchParams({
      search: filter.search,
      status: filter.status,
      startDate: filter.dateRange.start?.toISOString() || '',
      endDate: filter.dateRange.end?.toISOString() || ''
    })}`);

    if (!response.ok) {
      throw new Error('Failed to fetch BOM data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching BOM data:', error);
    throw error;
  }
} 