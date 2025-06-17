"use client"

import { useState, useEffect } from "react"
import { Save, User } from "lucide-react"

export default function UserSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState({
    employeeNumber: "",
    name: "",
    department: "",
    position: "",
    email: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  // ユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/user")
        const data = await response.json()
        if (data.success) {
          setCurrentUser(data.data)
        }
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [])

  // フォームの入力値を更新
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentUser({
      ...currentUser,
      [name]: value,
    })
  }

  // フォームの送信
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // ここでAPIを呼び出してユーザー情報を更新
      // 実際のAPIエンドポイントは実装されていないため、成功したと仮定
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 保存処理のシミュレーション

      setMessage({ type: "success", text: "ユーザー情報が正常に更新されました" })
    } catch (error) {
      console.error("ユーザー情報の更新に失敗しました:", error)
      setMessage({ type: "error", text: "ユーザー情報の更新に失敗しました" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ユーザー設定</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {message.text && (
              <div
                className={`p-4 mb-6 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {message.text}
              </div>
            )}

            <div className="flex items-center justify-center mb-8">
              <div className="bg-gray-200 rounded-full p-8 inline-block">
                <User className="h-16 w-16 text-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">社員番号</label>
                <input
                  type="text"
                  name="employeeNumber"
                  className="w-full p-2 border rounded bg-gray-100"
                  value={currentUser.employeeNumber}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">社員番号は変更できません</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">氏名 *</label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded"
                  value={currentUser.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部署</label>
                <input
                  type="text"
                  name="department"
                  className="w-full p-2 border rounded"
                  value={currentUser.department || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">役職</label>
                <input
                  type="text"
                  name="position"
                  className="w-full p-2 border rounded"
                  value={currentUser.position || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded"
                  value={currentUser.email || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    保存
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
