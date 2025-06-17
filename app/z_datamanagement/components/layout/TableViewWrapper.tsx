"use client"

import React from "react"
import { ColumnSettingsProvider } from "../context/ColumnSettingsContext"

interface TableViewWrapperProps {
  children: React.ReactNode
}

export default function TableViewWrapper({ children }: TableViewWrapperProps) {
  return (
    <ColumnSettingsProvider>
      {children}
    </ColumnSettingsProvider>
  )
} 