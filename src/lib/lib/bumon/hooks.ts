"use client"

import { useState, useEffect } from "react"
import type { DepartmentHistory, MemberHistory } from "./types"

// 部門履歴フックス
export function useDepartmentHistory() {
  const [data, setData] = useState<DepartmentHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        // APIから取得
        const response = await fetch("/api/bumon/history")
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setData(data.history || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const deleteHistory = async (id: number) => {
    try {
      // APIを呼び出し
      const response = await fetch(`/api/bumon/history?id=${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      setData(data.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete history"))
      throw err
    }
  }

  return { data, isLoading, error, deleteHistory }
}

// 部門メンバー履歴フックス
export function useMemberHistory() {
  const [data, setData] = useState<MemberHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        // APIから取得
        const response = await fetch("/api/bumon/member-history")
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setData(data.members || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const deleteMember = async (id: number) => {
    try {
      // APIを呼び出し
      const response = await fetch(`/api/bumon/member-history/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      setData(data.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete member history"))
      throw err
    }
  }

  return { data, isLoading, error, deleteMember }
}
