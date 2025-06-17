"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MainTabHeaderProps = {
  projectcode: string;
  currentTab: string;
}

const TABS = [
  { value: "main", label: "概要" },
  { value: "drawings", label: "図面" },
  { value: "3d", label: "3D" },
  { value: "members", label: "メンバー" },
  { value: "schedule", label: "予定表" },
  { value: "minutes", label: "議事録" },
  { value: "field", label: "現場/出張" },
  { value: "tasks", label: "タスク管理" },
  { value: "related", label: "関連Pro" },
  { value: "design", label: "設計" },
  { value: "manufacturing", label: "製造" },
  { value: "construction", label: "工事" },
  { value: "control", label: "制御" },
  { value: "documents", label: "Pro資料" },
  { value: "reports", label: "報告書" },
  { value: "meetings", label: "会議" },
  { value: "management", label: "管理" }
] as const;

export function MainTabHeader({ projectcode, currentTab }: MainTabHeaderProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    if (value === "management") {
      router.push(`/project/detail/${projectcode}/manage`);
    } else {
      router.push(`/project/detail/${projectcode}/${value}/main`);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="w-full px-6">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start bg-transparent border-0 flex overflow-x-auto overflow-y-hidden whitespace-nowrap">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-base px-6 py-3 
                  data-[state=active]:bg-red-50 
                  data-[state=active]:text-red-600 
                  hover:bg-gray-50 
                  transition-colors 
                  duration-200
                  whitespace-nowrap"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
} 