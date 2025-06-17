import { Settings } from "lucide-react"

interface SettingsButtonProps {
  isWhiteTheme: boolean
}

export function SettingsButton({ isWhiteTheme }: SettingsButtonProps) {
  return (
    <button className={`p-2 rounded-full ${isWhiteTheme ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
      <Settings className="h-5 w-5" />
    </button>
  )
} 