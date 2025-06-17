import Link from 'next/link'

export const FileManagementHeader = () => {
  return (
    <header className="bg-blue-600 text-white border-b">
      <div className="max-w-7xl mx-auto p-2 flex gap-4 items-center">
        <div className="font-bold text-xl mr-4">ファイル管理システム</div>
        <Link href="/file-management" className="px-4 py-2 hover:bg-blue-700 rounded">メイン</Link>
        <Link href="/file-management/organize" className="px-4 py-2 hover:bg-blue-700 rounded">資料整理</Link>
        <Link href="/file-management/register" className="px-4 py-2 hover:bg-blue-700 rounded">資料登録</Link>
        <Link href="/file-management/project-view" className="px-4 py-2 hover:bg-blue-700 rounded">プロジェクト資料</Link>
        <Link href="/file-management/tech-view" className="px-4 py-2 hover:bg-blue-700 rounded">技術資料</Link>
        <Link href="/file-management/forms" className="px-4 py-2 hover:bg-blue-700 rounded">帳票類</Link>
      </div>
    </header>
  )
} 