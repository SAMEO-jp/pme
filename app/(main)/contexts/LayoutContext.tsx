"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { LoginModal } from "../layouts/Header/components/LoginModal"

interface LayoutContextType {
  expandedMenus: Record<string, boolean>
  toggleMenu: (menu: string) => void
  currentUser: {
    name: string
    employeeNumber: string
  }
  setCurrentUser: (user: { name: string; employeeNumber: string }) => void
  handleLogin: () => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    management: true,
    projects: false,
    settings: false,
  })

  const [currentUser, setCurrentUser] = useState<{ name: string; employeeNumber: string }>({
    name: "ゲスト",
    employeeNumber: "",
  })

  const [showLoginModal, setShowLoginModal] = useState(false)

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  const handleLogin = () => {
    setShowLoginModal(true)
  }

  return (
    <LayoutContext.Provider
      value={{
        expandedMenus,
        toggleMenu,
        currentUser,
        setCurrentUser,
        handleLogin,
      }}
    >
      {children}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
} 