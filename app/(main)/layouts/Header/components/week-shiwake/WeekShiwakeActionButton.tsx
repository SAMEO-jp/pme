import { ReactNode } from "react"

interface Props {
  onClick: () => void
  color: string
  icon: ReactNode
  children: ReactNode
}

export function WeekShiwakeActionButton({ onClick, color, icon, children }: Props) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-md ${color}`}
    >
      {icon}
      {children}
    </button>
  )
} 