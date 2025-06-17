"use client"
import { createContext, useContext, useState } from "react"

interface ColumnSettingsContextProps {
  showColumnSettings: boolean
  setShowColumnSettings: (v: boolean) => void
}

const ColumnSettingsContext = createContext<ColumnSettingsContextProps | undefined>(undefined)

export function useColumnSettings() {
  const ctx = useContext(ColumnSettingsContext)
  if (!ctx) throw new Error("useColumnSettings must be used within ColumnSettingsProvider")
  return ctx
}

export function ColumnSettingsProvider({ children }: { children: React.ReactNode }) {
  const [showColumnSettings, setShowColumnSettings] = useState(false)
  return (
    <ColumnSettingsContext.Provider value={{ showColumnSettings, setShowColumnSettings }}>
      {children}
    </ColumnSettingsContext.Provider>
  )
} 