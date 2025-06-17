import { Network, Info, ChevronRight, ChevronDown } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { TreeView } from "./page.client"

export const metadata: Metadata = {
  title: "高炉設備体系図 | 設備管理アプリ",
  description: "高炉の設備体系をツリー構造で表示するページ",
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

// データを階層構造に変換する関数
function convertToTreeData(data: Equipment[]) {
  // 2桁製番でグループ化
  const groupedByTwoDigits: { [key: string]: Equipment[] } = {};
  
  data.forEach(item => {
    const twoDigits = item.B_id.substring(0, 2);
    if (!groupedByTwoDigits[twoDigits]) {
      groupedByTwoDigits[twoDigits] = [];
    }
    groupedByTwoDigits[twoDigits].push(item);
  });

  // ツリーデータの構築
  const treeData = Object.entries(groupedByTwoDigits).map(([twoDigits, items]) => {
    // 2桁製番のアイテムを探す
    const parentItem = items.find(item => item.B_id.endsWith('00'));
    
    // 3桁製番でグループ化
    const groupedByThreeDigits: { [key: string]: Equipment[] } = {};
    items.forEach(item => {
      if (!item.B_id.endsWith('00')) {
        const threeDigits = item.B_id.substring(0, 3);
        if (!groupedByThreeDigits[threeDigits]) {
          groupedByThreeDigits[threeDigits] = [];
        }
        groupedByThreeDigits[threeDigits].push(item);
      }
    });

    // 3桁グループのツリーを構築
    const children = Object.entries(groupedByThreeDigits)
      .map(([threeDigits, subItems]) => {
        const subParentItem = subItems.find(item => item.B_id.endsWith('0')) || {
          B_id: threeDigits + '0',
          id_kind: 'group',
          setsubi_name: `グループ ${threeDigits}`,
          setsubi_english_name: `Group ${threeDigits}`,
          level: 1,
          isExpanded: false
        };
        
        return {
          ...subParentItem,
          children: subItems
            .filter(item => !item.B_id.endsWith('0'))
            .sort((a, b) => a.B_id.localeCompare(b.B_id))
        };
      })
      .filter(item => item.B_id) // 無効なアイテムを除外
      .sort((a, b) => a.B_id.localeCompare(b.B_id));

    // 2桁製番の親アイテムが存在しない場合のフォールバック
    const defaultParentItem = {
      B_id: twoDigits + '00',
      id_kind: 'group',
      setsubi_name: `グループ ${twoDigits}`,
      setsubi_english_name: `Group ${twoDigits}`,
      level: 0,
      isExpanded: false
    };

    return {
      ...(parentItem || defaultParentItem),
      children
    };
  }).sort((a, b) => a.B_id.localeCompare(b.B_id));

  return treeData;
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
    return data.data || []
  } catch (error) {
    console.error('Error fetching equipment data:', error)
    return []
  }
}

export default async function TreePage() {
  const equipmentData = await getEquipmentData()
  const treeData = convertToTreeData(equipmentData)
  
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
                    <Link href="/prant/blast-furnace/system" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400">
                      設備体系表
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-600 dark:from-orange-400 dark:to-yellow-500">ツリー表示</h1>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">高炉設備の体系をツリー構造で表示します。階層関係を視覚的に確認できます。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ツリービュー */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800 dark:text-white">
              <Network className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
              設備体系ツリー
            </h2>
            
            <TreeView data={treeData} />
          </div>
        </div>

        {/* 説明セクション */}
        <div className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-white">
              <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              ツリー表示について
            </h2>
            
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <p>
                設備体系ツリーは、設備の階層関係を視覚的に表現します：
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>第1階層（2桁製番）</strong>：主要設備区分を表します</li>
                <li><strong>第2階層（3桁製番）</strong>：中分類の設備を表します</li>
                <li><strong>第3階層（4桁以上）</strong>：個別の設備要素を表します</li>
              </ul>
              
              <p className="mt-4">
                各ノードは展開/折りたたみが可能で、必要な部分だけを表示できます。
                また、各設備の詳細情報や英語名称も確認できます。
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