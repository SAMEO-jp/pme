"use client"

import { MainTabHeader } from "@xTabHeader/MainTabHeader";
import { SubTabHeader } from "@xTabHeader/SubTabHeader";

export default function PermissionsPage({ params }: { params: { projectcode: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainTabHeader projectcode={params.projectcode} currentTab="management" />
      <SubTabHeader projectcode={params.projectcode} currentTab="management" currentContent="permissions" />
      <main className="flex-1 p-6">
        <div className="text-2xl font-bold mb-4">権限設定</div>
        <div className="bg-white rounded-xl shadow p-8 text-gray-500">ここに権限設定の内容を実装してください。</div>
      </main>
    </div>
  )
} 