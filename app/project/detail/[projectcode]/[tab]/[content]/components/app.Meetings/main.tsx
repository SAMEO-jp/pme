"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, PlusCircle, Download, Link as LinkIcon } from "lucide-react"
import type { Project } from "@/lib/project/types"

type MeetingsMainProps = {
  project: Project
  mockData: {
    meetings: {
      id: number
      date: string
      title: string
    }[]
  }
}

export function MeetingsMain({ project, mockData }: MeetingsMainProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">プロジェクト議事録</h2>
        <Button className="bg-red-600 hover:bg-red-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          議事録追加
        </Button>
      </div>

      {/* 検索フィルター */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">キーワード検索</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="件名や内容で検索"
                />
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">会議種別</label>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">すべて</option>
                <option value="kickoff">キックオフ</option>
                <option value="progress">進捗会議</option>
                <option value="review">レビュー会議</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">期間</label>
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span>～</span>
                <input
                  type="date"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 議事録一覧 */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-red-500" />
            議事録リスト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left border-b">会議日</th>
                  <th className="px-4 py-3 text-left border-b">会議名</th>
                  <th className="px-4 py-3 text-left border-b">参加者</th>
                  <th className="px-4 py-3 text-left border-b">ステータス</th>
                  <th className="px-4 py-3 text-left border-b">議事録作成者</th>
                  <th className="px-4 py-3 text-left border-b">最終更新日</th>
                  <th className="px-4 py-3 text-left border-b">アクション</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">2025/05/08</td>
                  <td className="px-4 py-3 border-b">事前準備会議</td>
                  <td className="px-4 py-3 border-b">鈴木、佐藤、田中</td>
                  <td className="px-4 py-3 border-b">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">確定</span>
                  </td>
                  <td className="px-4 py-3 border-b">鈴木 一郎</td>
                  <td className="px-4 py-3 border-b">2025/05/09</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">2025/05/10</td>
                  <td className="px-4 py-3 border-b">キックオフ議事録</td>
                  <td className="px-4 py-3 border-b">鈴木、佐藤、田中、高橋、顧客2名</td>
                  <td className="px-4 py-3 border-b">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">確定</span>
                  </td>
                  <td className="px-4 py-3 border-b">鈴木 一郎</td>
                  <td className="px-4 py-3 border-b">2025/05/12</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">2025/05/17</td>
                  <td className="px-4 py-3 border-b">週次進捗会議</td>
                  <td className="px-4 py-3 border-b">鈴木、佐藤、田中</td>
                  <td className="px-4 py-3 border-b">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">レビュー中</span>
                  </td>
                  <td className="px-4 py-3 border-b">佐藤 二郎</td>
                  <td className="px-4 py-3 border-b">2025/05/18</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">2025/05/24</td>
                  <td className="px-4 py-3 border-b">設計レビュー議事録</td>
                  <td className="px-4 py-3 border-b">鈴木、佐藤、田中、高橋</td>
                  <td className="px-4 py-3 border-b">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">作成中</span>
                  </td>
                  <td className="px-4 py-3 border-b">田中 三郎</td>
                  <td className="px-4 py-3 border-b">2025/05/24</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">2025/05/31</td>
                  <td className="px-4 py-3 border-b">週次進捗会議</td>
                  <td className="px-4 py-3 border-b">鈴木、佐藤、田中</td>
                  <td className="px-4 py-3 border-b">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">作成中</span>
                  </td>
                  <td className="px-4 py-3 border-b">佐藤 二郎</td>
                  <td className="px-4 py-3 border-b">-</td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">全 5 件を表示</div>
          </div>
        </CardContent>
      </Card>

      {/* 議事録テンプレート */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <LinkIcon className="h-5 w-5 mr-2 text-blue-500" />
            議事録テンプレート
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            標準議事録テンプレート
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            キックオフミーティング用
          </Button>
          <Button variant="outline" className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            デザインレビュー用
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 