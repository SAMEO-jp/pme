"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SITE_TITLE,  isFileManagementPage, isZDataManagementPage, HEADER_GRID, HEADER_RIGHT, getHeaderBgClass, getLinkTextColorClass } from "./styles/siteStyle"
import { UserInfo } from "./components/UserInfo"
import { SettingsButton } from "./components/SettingsButton"
import { BackToDatabaseButton } from "./components/BackToDatabaseButton"
import { HeaderCenterTitle } from "./components/HeaderCenterTitle"
import { WeekShiwakeCenter } from "./components/week-shiwake/WeekShiwakeCenter"
import { WeekShiwakeActionButton } from "./components/week-shiwake/WeekShiwakeActionButton"
import { RefreshIcon } from "./components/week-shiwake/RefreshIcon"
import { SaveIcon } from "./components/week-shiwake/SaveIcon"
import { getWeekDates, formatDateShort } from "./utils/weekUtils"
import { useState, useEffect } from "react"
import { saveUserToLocalStorage, DEFAULT_USER } from "./utils/currentUser_LocalStorage"

interface HeaderProps {
  currentUser: {
    employeeNumber: string
    name: string
  }
  headerProject?: {
    name: string
    projectNumber: string
  } | null
  onLoginClick: () => void
  className?: string
}

// メインヘッダーコンポーネント
function MainHeader({ currentUser, headerProject, onLoginClick, className = "" }: HeaderProps) {
  const pathname = usePathname()
  const fileManagement = isFileManagementPage(pathname)
  const zDataManagement = isZDataManagementPage(pathname)

  // ユーザー情報の取得と保存
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 新しいAPIエンドポイントを使用
        const response = await fetch(`/api/header_local/current_user?userId=${currentUser.employeeNumber}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        if (!data.success) {
          console.error('Failed to save user data to localStorage');
          return;
        }

        // 取得したデータをlocalStorageに保存
        const success = await saveUserToLocalStorage(data.data);
        if (!success) {
          console.error('Failed to save user data to localStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (currentUser?.employeeNumber) {
      fetchUserData();
    } else {
      // ユーザーIDが存在しない場合はデフォルトユーザーを設定
      saveUserToLocalStorage(DEFAULT_USER);
    }
  }, [currentUser?.employeeNumber]);

  return (
    <header className={`border-b ${getHeaderBgClass(pathname)} ${className}`}>
      <div className={HEADER_GRID}>
        <div className="pl-6">
          <Link href="/" className={`text-2xl font-bold transition-colors ${getLinkTextColorClass(pathname)}`}>
            {SITE_TITLE}
          </Link>
        </div>
        
        {/* ヘッダー中央にファイル管理システム、またはデータベース閲覧ツールを表示 */}
        <div className="flex justify-center">
          <HeaderCenterTitle pathname={pathname} zDataManagement={zDataManagement} fileManagement={fileManagement} />
        </div>
        
        <div className={HEADER_RIGHT}>
          {/* データベース閲覧ツール用の戻るボタン */}
          {pathname.startsWith("/database_control/view_database") && <BackToDatabaseButton />}
          
          {/* ユーザー情報表示 */}
          <UserInfo userName={currentUser.name} onLoginClick={onLoginClick} isWhiteTheme={fileManagement || zDataManagement} />
          
          <SettingsButton isWhiteTheme={fileManagement || zDataManagement} />
        </div>
      </div>
    </header>
  )
}

// week-shiwake専用ヘッダーコンポーネント
function WeekShiwakeHeader({ year, week, currentUser, onLoginClick }: { year: number; week: number; currentUser: HeaderProps['currentUser']; onLoginClick: () => void }) {
  // 前週と翌週のリンクを計算
  const prevWeek = week === 1 ? 52 : week - 1
  const prevYear = week === 1 ? year - 1 : year
  const nextWeek = week === 52 ? 1 : week + 1
  const nextYear = week === 52 ? year + 1 : year
  const { startDate, endDate } = getWeekDates(year, week)
  const [saveMessage, setSaveMessage] = useState<{ type: string; text: string } | null>(null)
  useEffect(() => {
    const handleSaveMessage = (e: CustomEvent) => {
      setSaveMessage(e.detail)
      setTimeout(() => setSaveMessage(null), 5000)
    }
    window.addEventListener("week-save-message", handleSaveMessage as EventListener)
    return () => {
      window.removeEventListener("week-save-message", handleSaveMessage as EventListener)
    }
  }, [])
  return (
    <header className="border-b bg-white">
      <div className={HEADER_GRID}>
        <div className="pl-6">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            {SITE_TITLE}
          </Link>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <WeekShiwakeCenter
            year={year}
            week={week}
            prevYear={prevYear}
            prevWeek={prevWeek}
            nextYear={nextYear}
            nextWeek={nextWeek}
            startDate={startDate}
            endDate={endDate}
            formatDateShort={formatDateShort}
            saveMessage={saveMessage}
          />
        </div>
        <div className={HEADER_RIGHT}>
          <div className="flex items-center gap-2">
            <WeekShiwakeActionButton
              onClick={() => window.dispatchEvent(new CustomEvent("week-refresh"))}
              color="bg-gray-200 text-gray-800 hover:bg-gray-300"
              icon={<RefreshIcon />}
            >
              更新
            </WeekShiwakeActionButton>
            <WeekShiwakeActionButton
              onClick={() => window.dispatchEvent(new CustomEvent("week-save"))}
              color="bg-green-600 text-white hover:bg-green-700"
              icon={<SaveIcon />}
            >
              保存
            </WeekShiwakeActionButton>
            <UserInfo userName={currentUser.name} onLoginClick={onLoginClick} isWhiteTheme={false} />
            <SettingsButton isWhiteTheme={false} />
          </div>
        </div>
      </div>
    </header>
  )
}

// ヘッダーコンポーネントのエクスポート
export function Header(props: HeaderProps) {
  const pathname = usePathname()
  console.log("Header - Current pathname:", pathname)
  console.log("Header - Props:", props)
  
  const weekShiwakeMatch = pathname.match(/^\/week-shiwake\/(\d+)\/(\d+)/)
  console.log("Header - weekShiwakeMatch:", weekShiwakeMatch)

  // week-shiwakeページの場合は専用ヘッダーを表示
  if (weekShiwakeMatch) {
    const year = parseInt(weekShiwakeMatch[1], 10)
    const week = parseInt(weekShiwakeMatch[2], 10)
    console.log("Header - Rendering WeekShiwakeHeader with:", { year, week })
    return <WeekShiwakeHeader year={year} week={week} currentUser={props.currentUser} onLoginClick={props.onLoginClick} />
  }

  // それ以外のページは通常のヘッダーを表示
  console.log("Header - Rendering MainHeader")
  return <MainHeader {...props} />
} 