"use client"

import { createContext } from "react"

export const ViewModeContext = createContext({
  viewMode: "table",
  setViewMode: (mode: string) => {}
}) 