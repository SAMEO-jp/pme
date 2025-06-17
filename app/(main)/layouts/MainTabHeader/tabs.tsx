"use client"
// このファイルはクライアントコンポーネントで動作（useContextなどReact Hooksが必要なため）

import * as React from "react"
import { cn } from "@/lib/utils" 
// Tailwindのクラスを動的に結合するユーティリティ関数（classNamesのようなもの）

// タブの状態（現在の選択値と切り替え関数）を保持するコンテキストを定義
const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: "",
  onValueChange: () => {}, // デフォルト（使われない）
})

/**
 * Tabs（親コンポーネント）
 * - 選択中のタブ値と変更用関数をコンテキストで子に渡す
 */
export function Tabs({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      {children}
    </TabsContext.Provider>
  )
}

/**
 * TabsList（タブ一覧のラッパー）
 * - タブボタン群の外枠として使う
 */
export function TabsList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex", className)}>
      {children}
    </div>
  )
}

/**
 * TabsTrigger（タブ個別のボタン）
 * - 現在選択されているタブと一致していれば選択状態のスタイルに
 * - 押すと onValueChange が呼ばれて選択が切り替わる
 */
export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string
  className?: string
  children: React.ReactNode
}) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
  const isSelected = value === selectedValue

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors",
        isSelected
          ? "bg-red-50 text-red-600" // 選択中のスタイル
          : "text-gray-600 hover:bg-gray-50", // 非選択時のホバーなど
        className // 外部から渡された追加クラス
      )}
    >
      {children}
    </button>
  )
}
