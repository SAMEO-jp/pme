"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import DrawingTable from "./components/DrawingTable"
import DrawingFilters from "./components/DrawingFilters"
import Pagination from "./components/Pagination"
import type { Drawing, DrawingFilters as DrawingFiltersType } from "./components/types"

// 仮のデータ
const MOCK_DRAWINGS: Drawing[] = [
  {
    id: 1,
    drawingNumber: "DWG-001",
    name: "基本設計図",
    department: "設計部",
    creator: "山田太郎",
    issueDate: "2024-05-01",
    revision: "A",
    status: "approved"
  },
  {
    id: 2,
    drawingNumber: "DWG-002",
    name: "詳細設計図",
    department: "設計部",
    creator: "鈴木一郎",
    issueDate: "2024-05-02",
    revision: "B",
    status: "in_progress"
  },
  // 他の図面データ...
];

export default function DrawingsPage() {
  const [filters, setFilters] = useState<DrawingFiltersType>({
    type: 'all',
    searchQuery: '',
    page: 1,
    pageSize: 10
  });

  const [drawings, setDrawings] = useState<Drawing[]>(MOCK_DRAWINGS);

  const handleFilterChange = (newFilters: DrawingFiltersType) => {
    setFilters(newFilters);
    // ここで実際のAPI呼び出しを行う
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    // ここで実際のAPI呼び出しを行う
  };

  const handleViewDrawing = (drawing: Drawing) => {
    // 図面の表示処理
    console.log('View drawing:', drawing);
  };

  const handleEditDrawing = (drawing: Drawing) => {
    // 図面の編集処理
    console.log('Edit drawing:', drawing);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">図面一覧</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          新規図面
        </Button>
      </div>

      <DrawingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <DrawingTable
        drawings={drawings}
        onView={handleViewDrawing}
        onEdit={handleEditDrawing}
      />

      <Pagination
        currentPage={filters.page}
        totalPages={Math.ceil(drawings.length / filters.pageSize)}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 