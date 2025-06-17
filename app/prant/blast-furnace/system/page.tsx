import { Network, Search, FileDown, Info, Filter, Plus, RefreshCw } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { EquipmentActions } from "./page.client"

export const metadata: Metadata = {
  title: "高炉設備体系表 | 設備管理アプリ",
  description: "高炉の設備体系を管理するページ",
}

// 設備データの型定義
interface Equipment {
  B_id: string;
  id_kind: string;
  setsubi_name: string;
  setsubi_english_name: string;
  level: number;
  isExpanded: boolean;
}

// データを階層構造に整理する関数
function organizeHierarchicalData(data: Equipment[]): Equipment[] {
  // id_kindに基づいてデータをソート
  const sortedData = [...data].sort((a, b) => {
    // まず2桁製番
    if (a.B_id.endsWith('00') && !b.B_id.endsWith('00')) return -1;
    if (!a.B_id.endsWith('00') && b.B_id.endsWith('00')) return 1;
    
    // 次に3桁製番
    if (a.B_id.endsWith('0') && !b.B_id.endsWith('0')) return -1;
    if (!a.B_id.endsWith('0') && b.B_id.endsWith('0')) return 1;
    
    // それ以外は通常のソート
    return a.B_id.localeCompare(b.B_id);
  });

  // レベルを設定
  return sortedData.map(item => {
    let level = 0;
    if (item.B_id.endsWith('00')) {
      level = 0; // 2桁製番
    } else if (item.B_id.endsWith('0')) {
      level = 1; // 3桁製番
    } else {
      level = 2; // 4桁以上の製番
    }
    return { ...item, level, isExpanded: true };
  });
}

// サーバーコンポーネントでAPIデータを取得
async function getEquipmentData(): Promise<Equipment[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/equipment/kouro`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch equipment data')
    }
    
    const data = await res.json()
    console.log('取得したデータ:', data);
    return organizeHierarchicalData(data.data || []);
  } catch (error) {
    console.error('Error fetching equipment data:', error)
    return []
  }
}

export default async function SystemPage() {
  const equipmentData = await getEquipmentData()
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-6 max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8 pt-8">
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-64 h-64 bg-orange-300 dark:bg-orange-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -top-4 left-48 w-64 h-64 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            
            <div className="relative bg-white dark:bg-slate-800 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <div className="bg-orange-600 p-3 rounded-xl text-white mr-4">
                  <Network className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Link href="/prant" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400">
                      設備管理システム
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <Link href="/prant/blast-furnace" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400">
                      高炉
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-600 dark:from-orange-400 dark:to-yellow-500">設備体系表</h1>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">高炉設備の体系を確認・管理するページです。各設備の関連性や階層構造を表示します。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 検索・フィルターエリア */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700">
            <EquipmentActions />
          </div>
        </div>

        {/* 設備体系表 */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800 dark:text-white">
              <Network className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
              高炉設備体系表
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-orange-50 dark:bg-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">製番</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">ID種別</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">設備名</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">設備名（英語）</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {equipmentData.length > 0 ? (
                    equipmentData.map((equipment: Equipment, index: number) => (
                      <tr 
                        key={equipment.B_id}
                        className={`
                          ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-700/50'}
                          ${equipment.level === 0 ? 'bg-orange-50 dark:bg-orange-900/20 font-bold' : ''}
                          ${equipment.level === 1 ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                          hover:bg-orange-50 dark:hover:bg-orange-900/10
                          transition-colors duration-150
                        `}
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <span 
                              className="inline-block"
                              style={{ 
                                paddingLeft: `${equipment.level * 20}px`,
                                position: 'relative'
                              }}
                            >
                              {equipment.level > 0 && (
                                <span 
                                  className="absolute left-0 top-1/2 w-4 h-0.5 bg-gray-300 dark:bg-gray-600"
                                  style={{
                                    transform: 'translateY(-50%)',
                                    left: `${(equipment.level - 1) * 20 + 8}px`
                                  }}
                                ></span>
                              )}
                              <span className={`
                                ${equipment.level === 0 ? 'text-orange-600 dark:text-orange-400' : ''}
                                ${equipment.level === 1 ? 'text-blue-600 dark:text-blue-400' : ''}
                              `}>
                                {equipment.B_id}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                          {equipment.id_kind}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex items-center">
                            <span 
                              className="inline-block"
                              style={{ 
                                paddingLeft: `${equipment.level * 20}px`,
                                position: 'relative'
                              }}
                            >
                              {equipment.level > 0 && (
                                <span 
                                  className="absolute left-0 top-1/2 w-4 h-0.5 bg-gray-300 dark:bg-gray-600"
                                  style={{
                                    transform: 'translateY(-50%)',
                                    left: `${(equipment.level - 1) * 20 + 8}px`
                                  }}
                                ></span>
                              )}
                              {equipment.setsubi_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                          {equipment.setsubi_english_name}
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-gray-200 dark:border-gray-600">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">
                            詳細
                          </button>
                          <button className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300">
                            編集
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        設備データが見つかりませんでした。新しい設備を追加してください。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 説明セクション */}
        <div className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              高炉設備体系について
            </h2>
            
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>
                高炉設備は4桁の製番コードで管理されており、各桁は以下の意味を持ちます：
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>最初の2桁（大設備番号）</strong>：主要設備区分を表します（例：11は本体設備、12は送風設備）</li>
                <li><strong>3桁目（中設備番号）</strong>：大設備内のサブカテゴリーを表します</li>
                <li><strong>4桁目（小設備番号）</strong>：詳細な設備要素を表します</li>
              </ul>
              
              <p className="mt-4">
                例えば、製番「1121」は以下を意味します：
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>大設備番号「11」：本体設備</li>
                <li>中設備番号「2」：炉頂装入設備</li>
                <li>小設備番号「1」：ベルレス装入装置</li>
              </ul>
              
              <p className="mt-4">
                この階層構造により、高炉内のすべての設備を体系的に管理することができます。
                設備の保守点検履歴や図面、仕様書などは、この製番に紐づけて管理されています。
              </p>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 製鉄所設備管理システム</p>
        </div>
      </div>
    </div>
  )
} 