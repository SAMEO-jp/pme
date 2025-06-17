import { User, LogIn } from "lucide-react" // アイコン（ユーザー・ログイン）をインポート
import { useState, useEffect } from "react"
import { LoginModal } from "./LoginModal" // ログイン用モーダル
import { getUserFromLocalStorage } from "../utils/currentUser_LocalStorage" // ローカルストレージからユーザー取得関数
import { updateCurrentProjects } from "../utils/currentUser_project_LocalStorage" // プロジェクトデータ更新関数

// コンポーネントのProps
interface UserInfoProps {
  isWhiteTheme: boolean;
  userName: string;
  onLoginClick: () => void;
}

// ユーザー情報表示＋ログインモーダル制御コンポーネント
export function UserInfo({ isWhiteTheme, userName, onLoginClick }: UserInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false) // モーダルの表示状態

  // モーダルを閉じた時の処理
  const handleModalClose = async () => {
    setIsModalOpen(false)
    onLoginClick()
  }

  // ユーザーアイコンをクリックしてモーダルを開く
  const handleUserClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      {/* ユーザー表示エリア（名前＋切替ボタン） */}
      <div className={`flex items-center rounded-full py-1 px-3 ${isWhiteTheme ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'}`}>
        {/* ユーザーアイコン */}
        <User className={`h-5 w-5 mr-2 ${isWhiteTheme ? 'text-white' : 'text-gray-600'}`} />

        {/* ユーザー名 */}
        <span className="text-sm font-medium">{userName}</span>

        {/* ユーザー切替ボタン（ログインアイコン） */}
        <button
          onClick={handleUserClick}
          className={`ml-2 p-1 rounded-full ${isWhiteTheme ? 'hover:bg-white/20' : 'hover:bg-gray-200'}`}
          title="ユーザー切替"
        >
          <LogIn className={`h-4 w-4 ${isWhiteTheme ? 'text-white' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* ログインモーダル（開閉制御） */}
      <LoginModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  )
}
