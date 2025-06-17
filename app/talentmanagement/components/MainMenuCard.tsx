"use client"

interface MainMenuCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick?: () => void
}

export function MainMenuCard({ icon, title, subtitle, onClick }: MainMenuCardProps) {
  return (
    <button
      className="w-full h-32 bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-start justify-between p-4 border border-gray-100 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      onClick={onClick}
      type="button"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div>
        <div className="font-bold text-lg text-gray-800">{title}</div>
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      </div>
    </button>
  )
} 