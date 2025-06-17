import Link from "next/link"
import { Building, History, Home, List } from "lucide-react"

export function MainNav() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/bumon" className="flex items-center gap-2 font-semibold">
          <Building className="h-6 w-6" />
          <span>部門情報管理システム</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/bumon"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            <span>ホーム</span>
          </Link>
          <Link
            href="/bumon/list"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <List className="h-4 w-4" />
            <span>部門一覧</span>
          </Link>
          <Link
            href="/bumon/new"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <Building className="h-4 w-4" />
            <span>部門情報入力</span>
          </Link>
          <Link
            href="/bumon/history"
            className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-primary"
          >
            <History className="h-4 w-4" />
            <span>履歴管理</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
