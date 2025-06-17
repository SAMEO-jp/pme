/**
 * activity-typesに関連するクライアントサイドからの操作をまとめたファイル
 * 複数のデータベース・テーブルに対応できるようにする
 */

import { useState, useEffect } from "react"

/**
 * 活動タイプ一覧を取得する関数
 * @param dbName オプション：データベース名（指定がなければデフォルトのDBを使用）
 * @returns 活動タイプデータの配列
 */
export async function getActivityTypes(dbName?: string) {
  try {
    let url = "/api/activity-types"
    if (dbName) {
      url += `?dbName=${encodeURIComponent(dbName)}`
    }
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "活動タイプデータの取得に失敗しました")
    }

    return data.data || []
  } catch (error) {
    console.error("活動タイプデータの取得中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 活動タイプのカラム情報を取得する関数
 * @param dbName オプション：データベース名（指定がなければデフォルトのDBを使用）
 * @param tableName オプション：テーブル名（指定がなければデフォルトのテーブルを使用）
 * @returns カラム情報の配列
 */
export async function getActivityTypeColumns(dbName?: string, tableName?: string) {
  try {
    let url = "/api/activity-types/columns"
    const params = new URLSearchParams()
    if (dbName) params.append("dbName", dbName)
    if (tableName) params.append("tableName", tableName)
    
    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "活動タイプのカラム情報の取得に失敗しました")
    }

    return data.data || []
  } catch (error) {
    console.error("活動タイプのカラム情報取得中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 活動タイプを追加する関数
 * @param activityType 追加する活動タイプデータ
 * @param dbName オプション：データベース名（指定がなければデフォルトのDBを使用）
 * @returns 追加された活動タイプデータ
 */
export async function addActivityType(activityType: any, dbName?: string) {
  try {
    let url = "/api/activity-types"
    if (dbName) {
      url += `?dbName=${encodeURIComponent(dbName)}`
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityType),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "活動タイプの追加に失敗しました")
    }

    return data.data
  } catch (error) {
    console.error("活動タイプの追加中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 活動タイプを更新する関数
 * @param activityType 更新する活動タイプデータ（typeCodeを含む）
 * @param dbName オプション：データベース名（指定がなければデフォルトのDBを使用）
 * @returns 更新が成功したかどうか
 */
export async function updateActivityType(activityType: any, dbName?: string) {
  try {
    let url = "/api/activity-types"
    if (dbName) {
      url += `?dbName=${encodeURIComponent(dbName)}`
    }
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityType),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "活動タイプの更新に失敗しました")
    }

    return true
  } catch (error) {
    console.error("活動タイプの更新中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 活動タイプを削除する関数
 * @param typeCode 削除する活動タイプのコード
 * @param dbName オプション：データベース名（指定がなければデフォルトのDBを使用）
 * @returns 削除が成功したかどうか
 */
export async function deleteActivityType(typeCode: string, dbName?: string) {
  try {
    let url = `/api/activity-types?typeCode=${typeCode}`
    if (dbName) {
      url += `&dbName=${encodeURIComponent(dbName)}`
    }
    
    const response = await fetch(url, {
      method: "DELETE",
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || "活動タイプの削除に失敗しました")
    }

    return true
  } catch (error) {
    console.error("活動タイプの削除中にエラーが発生しました:", error)
    throw error
  }
}

/**
 * 活動タイプ一覧を取得するためのカスタムフック
 * データの取得と状態管理を行います
 * @param dbName オプション：データベース名
 * @returns 活動タイプデータと読み込み状態
 */
export function useActivityTypes(dbName?: string) {
  const [activityTypes, setActivityTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getActivityTypes(dbName)
        if (isMounted) {
          setActivityTypes(data)
          setError(null)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "活動タイプの取得に失敗しました")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()
    
    return () => {
      isMounted = false
    }
  }, [dbName])

  return { activityTypes, loading, error, refetch: () => setLoading(true) }
} 