import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { searchUserById, searchUsersByName, formatUserInfo, User } from '../utils/userSearch'
import { updateCurrentUser } from '../utils/currentUser_LocalStorage'
import { updateCurrentProjects } from '../utils/currentUser_project_LocalStorage'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [userId, setUserId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // モーダルが閉じられたときに状態をリセット
  useEffect(() => {
    if (!isOpen) {
      setUserId('')
      setSearchQuery('')
      setSearchResults([])
      setError(null)
    }
  }, [isOpen])

  // 検索クエリが変更されたときに検索を実行
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.length >= 1) {
      setIsLoading(true)
      searchTimeoutRef.current = setTimeout(async () => {
        const result = await searchUsersByName(searchQuery)
        setSearchResults(result.users)
        setIsLoading(false)
      }, 300) // 300msのディレイ
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // ユーザーIDによるログイン
  const handleUserIdLogin = async () => {
    if (!userId) {
      setError('ユーザーIDを入力してください')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 1. ユーザー情報の取得
      const user = await searchUserById(userId)
      if (!user) {
        setError('ユーザーが見つかりません')
        return
      }

      // 2. ログイン処理（currentUserの作成）
      const success = await updateCurrentUser(user.user_id)
      if (!success) {
        setError('ログインに失敗しました')
        return
      }

      // 3. プロジェクト情報の取得と保存
      const projectsSuccess = await updateCurrentProjects(user.user_id)
      if (!projectsSuccess) {
        console.error('プロジェクト情報の取得に失敗しました')
      }

      // 4. ログイン成功
      onClose()
    } catch (error) {
      setError('ログイン中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  // 検索結果からユーザーを選択
  const handleUserSelect = (user: User) => {
    setUserId(user.user_id)
    setSearchQuery('')
    setSearchResults([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">ユーザー切り替え</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ユーザーID入力 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ユーザーID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="ユーザーIDを入力"
            />
            <button
              onClick={handleUserIdLogin}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              ログイン
            </button>
          </div>
        </div>

        {/* 名前検索 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名前で検索
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="苗字や名前の一部を入力"
          />
        </div>

        {/* 検索結果 */}
        {searchResults.length > 0 && (
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {searchResults.map((user) => (
              <button
                key={user.user_id}
                onClick={() => handleUserSelect(user)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b last:border-b-0"
              >
                {formatUserInfo(user)}
              </button>
            ))}
          </div>
        )}

        {/* エラーメッセージ */}
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* ローディング表示 */}
        {isLoading && (
          <div className="mt-2 text-gray-500 text-sm">
            読み込み中...
          </div>
        )}
      </div>
    </div>
  )
} 