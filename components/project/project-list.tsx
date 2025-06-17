"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/lib/project/types"

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/project/list")
        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">プロジェクト一覧</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          新規プロジェクト
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">プロジェクトコード: {project.code}</p>
                <p className="text-sm text-gray-600">ステータス: {project.status}</p>
                <div className="pt-2">
                  <Link href={`/project/detail/${project.code}/main/main`}>
                    <Button variant="outline" className="w-full">
                      詳細を見る
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 