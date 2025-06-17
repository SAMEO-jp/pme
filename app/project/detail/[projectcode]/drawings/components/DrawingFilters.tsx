"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DrawingType, DrawingFilters } from "./types"

interface DrawingFiltersProps {
  filters: DrawingFilters;
  onFilterChange: (filters: DrawingFilters) => void;
}

const DRAWING_TYPES: { value: DrawingType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'plan', label: '計画図' },
  { value: 'assembly', label: '組立図' },
  { value: 'detail', label: '詳細図' },
  { value: 'construction', label: '施工図' },
  { value: 'purchase', label: '購入図' },
  { value: 'memo', label: 'メモ' }
];

export default function DrawingFilters({ filters, onFilterChange }: DrawingFiltersProps) {
  const handleTypeChange = (value: DrawingType) => {
    onFilterChange({ ...filters, type: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  return (
    <div className="flex space-x-4 mb-4">
      <Select value={filters.type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="図面種別" />
        </SelectTrigger>
        <SelectContent>
          {DRAWING_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="図面番号・名称で検索"
        value={filters.searchQuery}
        onChange={handleSearchChange}
        className="w-[300px]"
      />
    </div>
  );
} 