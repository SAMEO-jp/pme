"use client"

import { MainTabHeader } from "../../[tab]/[content]/components/x.TabHeader/MainTabHeader"
import { SubTabHeader } from "../../[tab]/[content]/components/x.TabHeader/SubTabHeader"
import { DesignAnalysis } from "../../[tab]/[content]/components/app.Design/analysis"

export default function AnalysisPage({ params }: { params: { projectcode: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainTabHeader projectcode={params.projectcode} currentTab="design" />
      <SubTabHeader projectcode={params.projectcode} currentTab="design" currentContent="analysis" />
      
      <main className="flex-1 p-6">
        <DesignAnalysis project={null} />
      </main>
    </div>
  )
} 