"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface Department {
  bumon_id: string
  name: string
}

export function DepartmentSelector() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch("/api/project/bumon-list")
        if (!response.ok) throw new Error("Failed to fetch departments")
        const data = await response.json()
        setDepartments(data)
      } catch (error) {
        console.error("Error fetching departments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartments()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          部門を選択
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>部門一覧</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <DropdownMenuItem disabled>読み込み中...</DropdownMenuItem>
        ) : departments.length > 0 ? (
          departments.map((dept) => (
            <DropdownMenuItem key={dept.bumon_id} asChild>
              <Link href={`/project/projectlist/department/${encodeURIComponent(dept.name)}`}>{dept.name}</Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>部門が見つかりません</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
