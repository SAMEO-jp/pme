"use client"

import { MainMenuCard } from "./MainMenuCard"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    icon: "📖",
    title: "プロフィールブック",
    subtitle: "社員台帳・写真の名簿",
    href: "/talentmanagement/profile-book",
  },
  {
    icon: "🗂️",
    title: "シートガレージ",
    subtitle: "評価・調査票を一元集約",
    href: "/talentmanagement/sheet-garage",
  },
  {
    icon: "📋",
    title: "ピックアップリスト",
    subtitle: "選抜・配置リスト作成ページ",
    href: "/talentmanagement/pickup-list",
  },
  {
    icon: "🔀",
    title: "シャッフルフェイス",
    subtitle: "候補者比較・マッチング",
    href: "/talentmanagement/shuffle-face",
  },
  {
    icon: "🔊",
    title: "ボイスノート",
    subtitle: "アンケート作成・集計・分析",
    href: "/talentmanagement/voice-note",
  },
  {
    icon: "🏠",
    title: "スマートレビュー",
    subtitle: "評価ワークフロー",
    href: "/talentmanagement/smart-review",
  },
  {
    icon: "💬",
    title: "チャートボード",
    subtitle: "組織図・人員シミュレーション",
    href: "/talentmanagement/chart-board",
  },
  {
    icon: "🌲",
    title: "シナプスツリー",
    subtitle: "後継者管理・キャリアパス",
    href: "/talentmanagement/synapse-tree",
  },
  {
    icon: "🔗",
    title: "コネクトカミング",
    subtitle: "他社との連携・SPSS",
    href: "/talentmanagement/connect-coming",
  },
  {
    icon: "🔍",
    title: "タレントファインダー",
    subtitle: "最適な人材検索",
    href: "/talentmanagement/talent-finder",
  },
  {
    icon: "📝",
    title: "パルスサーベイ",
    subtitle: "従業員意識・満足度を知る",
    href: "/talentmanagement/pulse-survey",
  },
  {
    icon: "📊",
    title: "ダッシュボード",
    subtitle: "組織全体の状況を可視化",
    href: "/talentmanagement/dashboard",
  },
]

export function MainMenuGrid() {
  const router = useRouter()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {menuItems.map((item) => (
        <MainMenuCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          onClick={() => router.push(item.href)}
        />
      ))}
    </div>
  )
} 