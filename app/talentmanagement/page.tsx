"use client"

import { useState } from "react"
import { TalentDashboard } from "./components/TalentDashboard"
import { TalentSidebar } from "./components/TalentSidebar"
import { TalentHeader } from "./components/TalentHeader"

export default function TalentManagementPage() {
  const [selectedTab, setSelectedTab] = useState("dashboard")
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドバー */}
      <TalentSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <TalentHeader />

        {/* メインコンテンツエリア */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <TalentDashboard
              selectedTab={selectedTab}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />
          </div>
        </main>
      </div>
    </div>
  )
} 