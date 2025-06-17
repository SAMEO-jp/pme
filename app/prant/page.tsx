import Link from "next/link"
import { Factory, Building, Flame, Scissors, Layers } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "設備管理アプリ",
  description: "製鉄所の主要設備の管理システム",
}

export default function PrantPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 設備一覧 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-500 dark:from-white dark:to-gray-400">主要設備</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 高炉 */}
          <Link
            href="/prant/blast-furnace"
            className="group relative bg-gradient-to-br from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800 p-1 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl shadow-md"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  <Factory className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">高炉</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                高炉の図面、トラブル記録、設計遷移、設計条件、開発状況などを確認できます。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">運転中</span>
                <span className="text-sm bg-red-50 dark:bg-red-900/20 py-1 px-3 rounded-full text-red-600 dark:text-red-400">
                  温度: 1,450℃
                </span>
              </div>
            </div>
          </Link>

          {/* 製鋼 */}
          <Link
            href="/prant/steelmaking"
            className="group relative bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 p-1 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl shadow-md"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl mr-4 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/50 transition-colors">
                  <Building className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">製鋼</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                転炉での製鋼プロセスを確認できます。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">運転中</span>
                <span className="text-sm bg-yellow-50 dark:bg-yellow-900/20 py-1 px-3 rounded-full text-yellow-600 dark:text-yellow-400">
                  処理量: 250t/h
                </span>
              </div>
            </div>
          </Link>

          {/* CDQ */}
          <Link
            href="/prant/cdq"
            className="group relative bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 p-1 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl shadow-md"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Flame className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">CDQ</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                コークス乾式消火設備の図面などを確認できます。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">運転中</span>
                <span className="text-sm bg-blue-50 dark:bg-blue-900/20 py-1 px-3 rounded-full text-blue-600 dark:text-blue-400">
                  熱回収率: 85%
                </span>
              </div>
            </div>
          </Link>

          {/* 圧延 */}
          <Link
            href="/prant/rolling"
            className="group relative bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 p-1 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl shadow-md"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Scissors className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">圧延</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                熱間・冷間圧延の製品厚み精度、表面品質、ライン速度などを確認できます。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">運転中</span>
                <span className="text-sm bg-green-50 dark:bg-green-900/20 py-1 px-3 rounded-full text-green-600 dark:text-green-400">
                  生産量: 180t/h
                </span>
              </div>
            </div>
          </Link>

          {/* 連鋳 */}
          <Link
            href="/prant/continuous-casting"
            className="group relative bg-gradient-to-br from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 p-1 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl shadow-md"
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 h-full">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Layers className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">連鋳</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                連続鋳造設備の運転状況、鋳片品質、冷却制御、二次冷却水量などを確認できます。
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">運転中</span>
                <span className="text-sm bg-purple-50 dark:bg-purple-900/20 py-1 px-3 rounded-full text-purple-600 dark:text-purple-400">
                  鋳造速度: 1.2m/min
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* フッター */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 製鉄所設備管理システム</p>
      </div>
    </div>
  )
} 