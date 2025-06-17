import Link from 'next/link'

export const DataManagementHeader = () => {
  return (
    <header className="bg-blue-600 text-white border-b">
      <div className="max-w-7xl mx-auto p-2 flex gap-8">
        <Link href="/z_datamanagement/main/all/index" className="px-4 py-2 hover:bg-blue-700 rounded">メイン</Link>
        <Link href="/z_datamanagement/column_config/all/index" className="px-4 py-2 hover:bg-blue-700 rounded">テーブル／カラム設定</Link>
        <Link href="/z_datamanagement/other/all/index" className="px-4 py-2 hover:bg-blue-700 rounded">その他</Link>
      </div>
    </header>
  )
} 