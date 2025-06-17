"use client" 
// このファイルはクライアントコンポーネントとして動作する（usePathnameはサーバーで使えない）

import { usePathname } from "next/navigation" 
// 現在のURLパス（pathname）を取得するためのフック（Next.jsのクライアント専用）

// 各ページ種別に対応するURLパスのパターンを定義
// キー名はそのまま「isXxxPage」としてブール値で使いたい変数名
const PAGE_PATTERNS = {
  isWeekShiwakePage: "/week-shiwake",
  isDataDisplayPage: "/data-display",
  isActivityTypesPage: "/activity-types",
  isPrantPage: "/prant",
  isZDataManagementPage: "/z_datamanagement",
  isFileManagementPage: "/file-management",
} as const

// 各キーに対して boolean を持つ型を動的に生成（isXxxPage: boolean の集合）
type PageType = {
  [K in keyof typeof PAGE_PATTERNS]: boolean
}

// 現在のページパスに基づいて、各ページが該当するかどうかを判定するフック
export function usePageType(): PageType {
  const pathname = usePathname() 
  // 現在のURLのパスを取得（例: "/file-management/project-view"）

  const flags = Object.fromEntries(
    Object.entries(PAGE_PATTERNS).map(([key, prefix]) => [
      key,
      pathname.startsWith(prefix), 
      // それぞれのprefixで現在のパスが始まっているかを判定 → true/false
    ])
  ) as PageType 
  // 結果をオブジェクトとしてまとめ、型を明示的にPageTypeにキャスト

  return flags 
  // ブール値のオブジェクトを返す（例: { isFileManagementPage: true, ... }）
}

