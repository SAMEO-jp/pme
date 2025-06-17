"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SubTabHeaderProps = {
  currentTab: string;
  currentContent: string;
}

// タブとサブタブのマッピング
const TAB_MAPPING: Record<string, { 
  subTabs: { value: string; label: string }[]
}> = {
  "main": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "summary", label: "サマリー" },
      { value: "kpi", label: "KPI" }
    ]
  },
  "drawings": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "list", label: "一覧" },
      { value: "history", label: "履歴" }
    ]
  },
  "project": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "list", label: "一覧" },
      { value: "details", label: "詳細" }
    ]
  },
  "history": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "timeline", label: "タイムライン" },
      { value: "documents", label: "文書" }
    ]
  },
  "wbs": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "schedule", label: "スケジュール" },
      { value: "progress", label: "進捗" }
    ]
  },
  "troubles": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "list", label: "一覧" },
      { value: "analysis", label: "分析" }
    ]
  },
  "3d": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "viewer", label: "ビューア" },
      { value: "models", label: "モデル" }
    ]
  }
};

export function SubTabHeader({ currentTab, currentContent }: SubTabHeaderProps) {
  const router = useRouter();

  const handleSubTabChange = (value: string) => {
    router.push(`/prant/blast-furnace/${currentTab}/${value}`);
  };

  // 現在のタブに対応するサブタブを取得
  const currentTabConfig = TAB_MAPPING[currentTab];
  const subTabs = currentTabConfig?.subTabs || [];

  return (
    <div className="sticky top-[45px] z-40 bg-white border-b shadow-sm">
      <div className="w-full px-6">
        <Tabs value={currentContent} onValueChange={handleSubTabChange}>
          <TabsList className="w-full justify-center bg-transparent border-0 flex">
            {subTabs.map((tab) => (
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