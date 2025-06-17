"use client"

interface TalentSidebarProps {
  selectedTab: string
  setSelectedTab: (tab: string) => void
}

export function TalentSidebar({ selectedTab, setSelectedTab }: TalentSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "ダッシュボード", icon: "📊" },
    { id: "employees", label: "社員一覧", icon: "👥" },
    { id: "skills", label: "スキル管理", icon: "🎯" },
    { id: "evaluation", label: "評価管理", icon: "📝" },
    { id: "projects", label: "プロジェクト", icon: "📋" },
    { id: "reports", label: "レポート", icon: "📈" },
    { id: "settings", label: "設定", icon: "⚙️" },
  ]

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedTab === item.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedTab(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
} 