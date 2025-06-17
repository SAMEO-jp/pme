import { BOMFilter as BOMFilterType } from '@bom/types/bom';

interface BOMFilterProps {
  filter: BOMFilterType;
  onFilterChange: (filter: BOMFilterType) => void;
}

export function BOMFilter({ filter, onFilterChange }: BOMFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            検索
          </label>
          <input
            type="text"
            id="search"
            value={filter.search}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="部品番号または説明で検索"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            ステータス
          </label>
          <select
            id="status"
            value={filter.status}
            onChange={(e) => onFilterChange({ ...filter, status: e.target.value as BOMFilterType['status'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="active">有効</option>
            <option value="inactive">無効</option>
            <option value="pending">保留中</option>
          </select>
        </div>
      </div>
    </div>
  );
} 