"use client"

import { MainTabHeader } from "@xTabHeader/MainTabHeader";
import { SubTabHeader } from "@xTabHeader/SubTabHeader";

export default function ManagePage({ params }: { params: { projectcode: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainTabHeader projectcode={params.projectcode} currentTab="management" />
      <SubTabHeader projectcode={params.projectcode} currentTab="management" currentContent="main" />
      <main className="flex-1 p-6">
        <div className="text-2xl font-bold mb-4">管理概要</div>
        <div className="bg-white rounded-xl shadow p-8 text-gray-500">ここに管理概要の内容を実装してください。</div>
      </main>
    </div>
  )
} 