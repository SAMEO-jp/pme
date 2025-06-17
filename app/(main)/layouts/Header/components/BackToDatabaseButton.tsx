import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function BackToDatabaseButton() {
  return (
    <Link 
      href="/database_control" 
      className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition"
    >
      <ArrowLeft className="h-5 w-5 mr-2" />
      データベース管理へ戻る
    </Link>
  )
} 