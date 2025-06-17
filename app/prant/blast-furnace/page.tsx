import Link from "next/link"
import { FileText, Network, History, Settings, AlertTriangle, Database, Map } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import { MainTabHeader } from "./components/header/MainTabHeader"
import { SubTabHeader } from "./components/header/SubTabHeader"

export const metadata: Metadata = {
  title: "高炉 | 設備管理アプリ",
  description: "製鉄所の高炉設備の管理",
}

const japanPrefectures = [
  { id: "hokkaido", name: "北海道", position: { x: 82, y: 12 }, hasFurnace: true },
  { id: "aomori", name: "青森県", position: { x: 82, y: 30 }, hasFurnace: false },
  { id: "iwate", name: "岩手県", position: { x: 87, y: 35 }, hasFurnace: false },
  { id: "miyagi", name: "宮城県", position: { x: 87, y: 42 }, hasFurnace: false },
  { id: "akita", name: "秋田県", position: { x: 78, y: 38 }, hasFurnace: false },
  { id: "yamagata", name: "山形県", position: { x: 80, y: 45 }, hasFurnace: false },
  { id: "fukushima", name: "福島県", position: { x: 85, y: 50 }, hasFurnace: false },
  { id: "ibaraki", name: "茨城県", position: { x: 88, y: 58 }, hasFurnace: false },
  { id: "tochigi", name: "栃木県", position: { x: 84, y: 55 }, hasFurnace: false },
  { id: "gunma", name: "群馬県", position: { x: 78, y: 55 }, hasFurnace: false },
  { id: "saitama", name: "埼玉県", position: { x: 80, y: 60 }, hasFurnace: false },
  { id: "chiba", name: "千葉県", position: { x: 88, y: 63 }, hasFurnace: true },
  { id: "tokyo", name: "東京都", position: { x: 83, y: 63 }, hasFurnace: false },
  { id: "kanagawa", name: "神奈川県", position: { x: 80, y: 66 }, hasFurnace: true },
  { id: "niigata", name: "新潟県", position: { x: 75, y: 48 }, hasFurnace: false },
  { id: "toyama", name: "富山県", position: { x: 70, y: 52 }, hasFurnace: false },
  { id: "ishikawa", name: "石川県", position: { x: 65, y: 52 }, hasFurnace: false },
  { id: "fukui", name: "福井県", position: { x: 65, y: 57 }, hasFurnace: false },
  { id: "yamanashi", name: "山梨県", position: { x: 75, y: 60 }, hasFurnace: false },
  { id: "nagano", name: "長野県", position: { x: 73, y: 55 }, hasFurnace: false },
  { id: "gifu", name: "岐阜県", position: { x: 68, y: 59 }, hasFurnace: false },
  { id: "shizuoka", name: "静岡県", position: { x: 75, y: 65 }, hasFurnace: false },
  { id: "aichi", name: "愛知県", position: { x: 70, y: 65 }, hasFurnace: true },
  { id: "mie", name: "三重県", position: { x: 65, y: 67 }, hasFurnace: false },
  { id: "shiga", name: "滋賀県", position: { x: 63, y: 62 }, hasFurnace: false },
  { id: "kyoto", name: "京都府", position: { x: 60, y: 62 }, hasFurnace: false },
  { id: "osaka", name: "大阪府", position: { x: 58, y: 65 }, hasFurnace: false },
  { id: "hyogo", name: "兵庫県", position: { x: 55, y: 64 }, hasFurnace: true },
  { id: "nara", name: "奈良県", position: { x: 62, y: 67 }, hasFurnace: false },
  { id: "wakayama", name: "和歌山県", position: { x: 58, y: 70 }, hasFurnace: false },
  { id: "tottori", name: "鳥取県", position: { x: 50, y: 60 }, hasFurnace: false },
  { id: "shimane", name: "島根県", position: { x: 43, y: 60 }, hasFurnace: false },
  { id: "okayama", name: "岡山県", position: { x: 50, y: 65 }, hasFurnace: true },
  { id: "hiroshima", name: "広島県", position: { x: 43, y: 65 }, hasFurnace: true },
  { id: "yamaguchi", name: "山口県", position: { x: 35, y: 65 }, hasFurnace: true },
  { id: "tokushima", name: "徳島県", position: { x: 55, y: 73 }, hasFurnace: false },
  { id: "kagawa", name: "香川県", position: { x: 53, y: 70 }, hasFurnace: false },
  { id: "ehime", name: "愛媛県", position: { x: 45, y: 73 }, hasFurnace: false },
  { id: "kochi", name: "高知県", position: { x: 48, y: 78 }, hasFurnace: false },
  { id: "fukuoka", name: "福岡県", position: { x: 30, y: 70 }, hasFurnace: true },
  { id: "saga", name: "佐賀県", position: { x: 25, y: 70 }, hasFurnace: false },
  { id: "nagasaki", name: "長崎県", position: { x: 20, y: 73 }, hasFurnace: false },
  { id: "kumamoto", name: "熊本県", position: { x: 25, y: 78 }, hasFurnace: false },
  { id: "oita", name: "大分県", position: { x: 32, y: 75 }, hasFurnace: true },
  { id: "miyazaki", name: "宮崎県", position: { x: 32, y: 83 }, hasFurnace: false },
  { id: "kagoshima", name: "鹿児島県", position: { x: 25, y: 88 }, hasFurnace: false },
  { id: "okinawa", name: "沖縄県", position: { x: 25, y: 100 }, hasFurnace: false },
]

export default function BlastFurnacePage() {
  return (
    <div>
      <MainTabHeader currentTab="main" />
      <SubTabHeader currentTab="main" currentContent="main" />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* メニュー */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-400">高炉メニュー</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 過去図面 */}
            <Link
              href="/prant/blast-furnace/drawings"
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">過去図面</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                高炉の過去の設計図面や修正履歴を閲覧できます。各年代の設計変更も確認できます。
              </p>
            </Link>

            {/* 設備体系表 */}
            <Link
              href="/prant/blast-furnace/system"
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl mr-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                  <Network className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">設備体系表</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                高炉を構成する各設備の体系と関連性を確認できます。設備ID、メーカー情報も掲載。
              </p>
            </Link>

            {/* プロジェクト歴史表 */}
            <Link
              href="/prant/blast-furnace/history"
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <History className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">プロジェクト歴史表</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                高炉関連の過去から現在までのプロジェクト履歴を時系列で確認できます。
              </p>
            </Link>

            {/* 設計条件 */}
            <Link
              href="/prant/blast-furnace/specifications"
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Settings className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">設計条件</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                高炉の設計に関する各種条件や仕様を確認できます。設計根拠資料も閲覧可能です。
              </p>
            </Link>

            {/* トラブル記録 */}
            <Link
              href="/prant/blast-furnace/troubles"
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <AlertTriangle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">トラブル記録</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                過去のトラブル事例と対応策を記録しています。類似トラブルの解決策の参考になります。
              </p>
            </Link>

            {/* 部品データベース */}
            <Link
              href="/prant/blast-furnace/parts"
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl mr-4 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                  <Database className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">部品データベース</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                高炉の各部品の仕様、メーカー情報、在庫状況、交換周期などを検索できます。
              </p>
            </Link>
          </div>
        </div>

        {/* 日本地図 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-400">全国高炉設備マップ</h2>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              日本全国の高炉設備がある製鉄所の位置を確認できます。マーカーをクリックすると詳細情報を表示します。
            </p>
            
            <div className="relative w-full max-w-2xl mx-auto h-[600px] bg-blue-50 dark:bg-slate-700 rounded-xl">
              {/* 日本地図の輪郭 - 正確なSVG画像で表示 */}
              <img src="/jp.svg" alt="日本地図" className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-60" />
              
              {/* 都道府県マーカー */}
              {japanPrefectures.map((prefecture) => (
                <div 
                  key={prefecture.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125`} 
                  style={{ 
                    left: `${prefecture.position.x}%`, 
                    top: `${prefecture.position.y}%` 
                  }}
                >
                  {prefecture.hasFurnace ? (
                    <Link 
                      href={`/prant/blast-furnace/${prefecture.id}`} 
                      className="block"
                    >
                      <div className="relative">
                        <FileText className={`h-6 w-6 text-red-600 dark:text-red-400 filter drop-shadow-md`} />
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-700"></div>
                      </div>
                      <div className="absolute mt-1 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-900 px-2 py-1 rounded text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity shadow-md">
                        {prefecture.name}
                      </div>
                    </Link>
                  ) : (
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full opacity-50" title={prefecture.name}></div>
                  )}
                </div>
              ))}
              
              {/* 凡例 */}
              <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 p-3 rounded-lg shadow-md">
                <div className="text-sm font-medium text-gray-800 dark:text-white mb-2">凡例</div>
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">高炉設備あり</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">高炉設備なし</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
              高炉がある主な製鉄所：北海道（室蘭）、千葉（君津）、神奈川（京浜）、愛知（名古屋）、兵庫（加古川）、岡山（水島）、広島（福山）、山口（下松）、福岡（八幡）、大分（大分）
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 