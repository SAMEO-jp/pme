"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, PenTool } from "lucide-react"
import type { Drawing } from "./types"

interface DrawingTableProps {
  drawings: Drawing[];
  onView: (drawing: Drawing) => void;
  onEdit: (drawing: Drawing) => void;
}

const getStatusBadge = (status: Drawing['status']) => {
  const statusConfig = {
    draft: { label: '作成中', color: 'bg-blue-500' },
    review: { label: 'レビュー中', color: 'bg-yellow-500' },
    in_progress: { label: '進行中', color: 'bg-blue-500' },
    approved: { label: '確定', color: 'bg-green-500' },
    needs_revision: { label: '修正必要', color: 'bg-red-500' }
  };

  const config = statusConfig[status];
  return <Badge className={config.color}>{config.label}</Badge>;
};

export default function DrawingTable({ drawings, onView, onEdit }: DrawingTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left border-b">図面番号</th>
            <th className="px-4 py-3 text-left border-b">図面名称</th>
            <th className="px-4 py-3 text-left border-b">製番</th>
            <th className="px-4 py-3 text-left border-b">作成者</th>
            <th className="px-4 py-3 text-left border-b">出図日</th>
            <th className="px-4 py-3 text-left border-b">Rev</th>
            <th className="px-4 py-3 text-left border-b">状態</th>
            <th className="px-4 py-3 text-left border-b">操作</th>
          </tr>
        </thead>
        <tbody>
          {drawings.map((drawing) => (
            <tr key={drawing.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 border-b">{drawing.drawingNumber}</td>
              <td className="px-4 py-3 border-b">{drawing.name}</td>
              <td className="px-4 py-3 border-b">{drawing.department}</td>
              <td className="px-4 py-3 border-b">{drawing.creator}</td>
              <td className="px-4 py-3 border-b">{drawing.issueDate}</td>
              <td className="px-4 py-3 border-b">{drawing.revision}</td>
              <td className="px-4 py-3 border-b">{getStatusBadge(drawing.status)}</td>
              <td className="px-4 py-3 border-b">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onView(drawing)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => onEdit(drawing)}>
                    <PenTool className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 