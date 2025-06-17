"use client"

import { MainTabHeader } from "../../[tab]/[content]/components/x.TabHeader/MainTabHeader"
import { SubTabHeader } from "../../[tab]/[content]/components/x.TabHeader/SubTabHeader"
import { ManageMain } from "../components/main"

export default function MemberPage({ params }: { params: { projectcode: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainTabHeader projectcode={params.projectcode} currentTab="management" />
      <SubTabHeader projectcode={params.projectcode} currentTab="management" currentContent="members" />
      <main className="flex-1 p-6">
        <ManageMain projectcode={params.projectcode} />
      </main>
    </div>
  )
} 