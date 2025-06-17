"use client"
// クライアントコンポーネントであることを明示（useRouter/usePathnameを使用するため）
import { useRouter, usePathname } from "next/navigation"
// ルーター（画面遷移）と現在のパスを取得するためのNext.jsフック
import { Tabs, TabsList, TabsTrigger } from "@/app/(main)/layouts/MainTabHeader/tabs"
// カスタムUIコンポーネント（Shadcn UIまたはRadixベースのタブUI）
// Propsの型定義：現在選択中のタブの識別子
type MainTabHeaderProps = {
  currentTab: string;
}

// タブの一覧を定義（value＝URLパス、label＝表示名）
const TABS = [
  { value: "main", label: "メイン" },
  { value: "main/main_performance", label: "実績" },
  { value: "main/main_management", label: "管理" },
  { value: "main/main_statistics", label: "統計" },
  { value: "main/main_mypage", label: "Myページ" },
  { value: "main/main_design", label: "設計協力" },
  { value: "main/main_settings", label: "設定" },
  { value: "main/main_document_search", label: "資料探索" },
  { value: "main/main_indirect_work", label: "間接業務" },
  { value: "main/main_all", label: "ALL" }
] as const;

export function MainTabHeader({ currentTab }: MainTabHeaderProps) {
  const router = useRouter(); // ルーティング用のAPI（画面遷移など）
  const pathname = usePathname(); // 現在のURLパスを取得

  // メインページかどうかを判定
  const isMainPage = pathname === "/" || pathname.startsWith("/dashboard")

  // メインページ以外の場合は表示しない
  if (!isMainPage) {
    return null
  }

  // 現在のパスがルート（"/"）の場合は"main"タブをアクティブ扱い
  const activeTab = pathname === "/" ? "main" : currentTab;

  // タブが切り替わったときに呼ばれるハンドラー
  const handleTabChange = (value: string) => {
    if (value === "main") {
      router.push("/"); // "main"ならルートへ遷移
    } else {
      router.push(`/${value}`); // その他は該当パスへ遷移
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* 固定ヘッダーとして上部に表示 */}
      <div className="w-full px-6">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          {/* タブリスト全体のスタイル：スクロール対応、装飾なし */}
          <TabsList className="w-full justify-start bg-transparent border-0 flex overflow-hidden">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-base w-32 py-2
                  data-[state=active]:bg-red-50
                  data-[state=active]:text-red-600
                  hover:bg-gray-50"
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

export default MainTabHeader;
