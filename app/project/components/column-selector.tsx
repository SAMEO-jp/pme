"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import type { ColumnVisibility } from "@/lib/project/types"

interface ColumnSelectorProps {
  columns: { key: string; label: string }[]
  visibleColumns: ColumnVisibility
  onColumnChange: (columns: ColumnVisibility) => void
}

export function ColumnSelector({ columns, visibleColumns, onColumnChange }: ColumnSelectorProps) {
  const handleColumnToggle = (columnKey: string) => {
    onColumnChange({
      ...visibleColumns,
      [columnKey]: !visibleColumns[columnKey],
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Settings className="h-4 w-4 mr-2" />
          表示列
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>表示する列を選択</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={visibleColumns[column.key]}
            onCheckedChange={() => handleColumnToggle(column.key)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
