"use client"

import { ProjectHeader } from "@/app/project/components/project-header"

export default function ProjectHomePage() {
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <ProjectHeader />
      <div className="w-full px-6 py-6">
        {/* コンテンツは後で追加予定 */}
      </div>
    </div>
  )
}
