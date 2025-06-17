"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

type SubTabHeaderProps = {
  projectcode: string;
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
      { value: "progress", label: "進捗" }
    ]
  },
  "drawings": {
    subTabs: [
      { value: "main", label: "総括" },
      { value: "list", label: "メイン" },
      { value: "history", label: "履歴" },
      { value: "plan", label: "計画図" },
      { value: "assembly", label: "組立図" },
      { value: "detail", label: "詳細図" },
      { value: "layout", label: "板取図" },
      { value: "add", label: "図面追加" },
      { value: "management", label: "図面管理" },
      { value: "file", label: "ファイル管理" }
    ]
  },
  "3d": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "viewer", label: "ビューア" },
      { value: "models", label: "モデル" }
    ]
  },
  "members": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "roles", label: "役割" },
      { value: "contacts", label: "連絡先" }
    ]
  },
  "schedule": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "calendar", label: "カレンダー" },
      { value: "timeline", label: "タイムライン" }
    ]
  },
  "minutes": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "list", label: "一覧" },
      { value: "search", label: "検索" }
    ]
  },
  "field": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "reports", label: "報告書" },
      { value: "photos", label: "写真" }
    ]
  },
  "tasks": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "board", label: "ボード" },
      { value: "list", label: "一覧" }
    ]
  },
  "related": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "list", label: "一覧" },
      { value: "graph", label: "関連図" }
    ]
  },
  "design": {
    subTabs: [
      { value: "main", label: "設計概要" },
      { value: "basic", label: "基本設計" },
      { value: "detail", label: "詳細設計" },
      { value: "drawings", label: "図面管理" },
      { value: "specs", label: "仕様書" },
      { value: "calculations", label: "計算書" },
      { value: "changes", label: "設計変更" },
      { value: "reviews", label: "設計レビュー" },
      { value: "documents", label: "設計文書" },
      { value: "standards", label: "設計基準" },
      { value: "analysis", label: "分析" }
    ]
  },
  "manufacturing": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "process", label: "工程" },
      { value: "quality", label: "品質" }
    ]
  },
  "construction": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "schedule", label: "工程" },
      { value: "safety", label: "安全" }
    ]
  },
  "documents": {
    subTabs: [
      { value: "main", label: "メイン" },
      { value: "list", label: "一覧" },
      { value: "categories", label: "カテゴリ" }
    ]
  },
  "control": {
    subTabs: [
      { value: "main", label: "制御概要" },
      { value: "sequence", label: "シーケンス" },
      { value: "hmi", label: "HMI画面" },
      { value: "network", label: "ネットワーク" },
      { value: "safety", label: "安全制御" },
      { value: "alarm", label: "警報設定" },
      { value: "recipe", label: "レシピ管理" },
      { value: "history", label: "履歴管理" }
    ]
  },
  "cost": {
    subTabs: [
      { value: "main", label: "コスト概要" },
      { value: "budget", label: "予算管理" },
      { value: "actual", label: "実績管理" },
      { value: "forecast", label: "予測管理" },
      { value: "analysis", label: "分析" }
    ]
  },
  "quality": {
    subTabs: [
      { value: "main", label: "品質概要" },
      { value: "standards", label: "品質基準" },
      { value: "inspections", label: "検査管理" },
      { value: "issues", label: "不具合管理" },
      { value: "improvements", label: "改善活動" }
    ]
  },
  "risk": {
    subTabs: [
      { value: "main", label: "リスク概要" },
      { value: "identification", label: "リスク特定" },
      { value: "assessment", label: "リスク評価" },
      { value: "mitigation", label: "対策管理" },
      { value: "monitoring", label: "モニタリング" }
    ]
  },
  "management": {
    subTabs: [
      { value: "main", label: "管理概要" },
      { value: "members", label: "メンバー管理" },
      { value: "numbers", label: "製番管理" },
      { value: "related", label: "関連プロ管理" },
      { value: "permissions", label: "権限設定" }
    ]
  }
};

export function SubTabHeader({ projectcode, currentTab, currentContent }: SubTabHeaderProps) {
  const router = useRouter();

  const handleSubTabChange = (value: string) => {
    if (currentTab === "management") {
      const path = value === "members" ? "member" : value;
      router.push(`/project/detail/${projectcode}/manage/${path}`);
    } else {
      router.push(`/project/detail/${projectcode}/${currentTab}/${value}`);
    }
  };

  // 現在のタブに対応するサブタブを取得
  const currentTabConfig = TAB_MAPPING[currentTab];
  const subTabs = currentTabConfig?.subTabs || [];

  return (
    <div className="sticky top-[45px] z-40 bg-white border-b shadow-sm">
      <div className="w-full px-6">
        <Tabs value={currentContent} onValueChange={handleSubTabChange}>
          <TabsList className="w-full justify-start bg-transparent border-0 flex">
            {subTabs.map((tab) => {
              let href = "";
              if (currentTab === "management") {
                if (tab.value === "main") {
                  href = `/project/detail/${projectcode}/manage/`;
                } else {
                  const path = tab.value === "members" ? "member" : tab.value;
                  href = `/project/detail/${projectcode}/manage/${path}`;
                }
              } else {
                href = `/project/detail/${projectcode}/${currentTab}/${tab.value}`;
              }
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-base px-6 py-2 data-[state=active]:text-red-600 hover:bg-gray-50"
                  asChild
                >
                  <Link href={href}>{tab.label}</Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
} 