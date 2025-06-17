"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MainTabHeaderProps = {
  currentTab: string;
}

const TABS = [
  { value: "main", label: "メイン" },
  { value: "drawings", label: "図面" },
  { value: "project", label: "製番" },
  { value: "history", label: "歴史表" },
  { value: "wbs", label: "WBS" },
  { value: "troubles", label: "トラブル" },
  { value: "3d", label: "3Dデータ" }
] as const;

export function MainTabHeader({ currentTab }: MainTabHeaderProps) {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/prant/blast-furnace/${value}/main`);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="w-full px-6">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-center bg-transparent border-0 flex overflow-hidden">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-base px-6 py-2 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 hover:bg-gray-50"
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