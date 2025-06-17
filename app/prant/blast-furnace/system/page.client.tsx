"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Plus, RefreshCw, FileDown, Filter, X } from "lucide-react"

// 設備データの型定義
interface Equipment {
  B_id: string;
  id_kind: string;
  setsubi_name: string;
  setsubi_english_name: string;
  level: number;
  isExpanded: boolean;
}

// 大設備番号のオプション
const daiSeibanOptions = [
  { value: "11", label: "11: 本体設備" },
  { value: "12", label: "12: 送風設備" },
  { value: "13", label: "13: 出銑設備" },
  { value: "14", label: "14: ガス処理設備" },
  { value: "15", label: "15: 計測制御設備" },
]

export function EquipmentActions() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDaiSeiban, setFilterDaiSeiban] = useState("all")
  
  // 新規設備データの状態
  const [newEquipment, setNewEquipment] = useState({
    B_id: "",
    id_kind: "",
    setsubi_name: "",
    setsubi_english_name: ""
  })
  
  // 入力変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEquipment({
      ...newEquipment,
      [name]: value
    })
  }
  
  // 大設備番号選択ハンドラー
  const handleDaiSeibanChange = (value: string) => {
    setNewEquipment({
      ...newEquipment,
      B_id: value + "00",
      id_kind: "2桁製番"
    })
  }
  
  // 設備データ追加
  const handleAddEquipment = async () => {
    // バリデーション
    if (!newEquipment.B_id || !newEquipment.setsubi_name) {
      toast({
        title: "入力エラー",
        description: "製番と設備名は必須です。",
        variant: "destructive"
      })
      return
    }
    
    try {
      setIsLoading(true)
      
      // APIに送信
      const response = await fetch('/api/equipment/kouro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEquipment),
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "設備データ追加",
          description: "設備データが正常に追加されました。",
        })
        
        // ダイアログを閉じてフォームをリセット
        setIsAddDialogOpen(false)
        setNewEquipment({
          B_id: "",
          id_kind: "",
          setsubi_name: "",
          setsubi_english_name: ""
        })
        
        // リロードするにはここでロケーションをリロード
        window.location.reload()
      } else {
        throw new Error(data.error || 'エラーが発生しました')
      }
    } catch (error) {
      console.error("設備データ追加エラー:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "設備データの追加中にエラーが発生しました。",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // CSV出力
  const handleExportCsv = async () => {
    try {
      setIsLoading(true)
      
      // APIからデータ取得
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filterDaiSeiban) params.append('dai_seiban', filterDaiSeiban)
      
      const response = await fetch(`/api/equipment/kouro?${params.toString()}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        // CSVデータ作成
        const csvHeader = "製番,ID種別,設備名,設備名（英語）\n"
        const csvBody = data.data.map((item: Equipment) => 
          `${item.B_id},${item.id_kind},${item.setsubi_name},${item.setsubi_english_name}`
        ).join('\n')
        
        const csvContent = csvHeader + csvBody
        
        // ダウンロード用のリンク作成
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `equipment_list_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: "CSV出力",
          description: "CSVファイルのダウンロードが開始されました。",
        })
      } else {
        throw new Error(data.error || 'エラーが発生しました')
      }
    } catch (error) {
      console.error("CSV出力エラー:", error)
      toast({
        title: "CSV出力エラー",
        description: error instanceof Error ? error.message : "CSV出力中にエラーが発生しました。",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <form onSubmit={(e) => {
            e.preventDefault()
            const params = new URLSearchParams(window.location.search)
            if (searchTerm) {
              params.set('search', searchTerm)
            } else {
              params.delete('search')
            }
            window.location.href = `${window.location.pathname}?${params.toString()}`
          }}>
            <div className="relative">
              <input
                type="text"
                placeholder="設備名や製番で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
              >
                <Filter className="h-4 w-4" />
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
            onClick={() => {
              const filterDialog = document.getElementById('filter-dialog')
              if (filterDialog) {
                filterDialog.classList.toggle('hidden')
              }
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>絞り込み</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
            onClick={() => setIsAddDialogOpen(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>新規追加</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span>更新</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50"
            onClick={handleExportCsv}
            disabled={isLoading}
          >
            <FileDown className="h-4 w-4 mr-2" />
            <span>CSV出力</span>
          </Button>
        </div>
      </div>

      {/* フィルターパネル */}
      <div id="filter-dialog" className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hidden">
        <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">絞り込み条件</h3>
        <div className="flex gap-4 items-end">
          <div className="w-64">
            <Label htmlFor="filter-dai-seiban" className="text-xs text-gray-600 dark:text-gray-400">大設備番号</Label>
            <Select value={filterDaiSeiban} onValueChange={setFilterDaiSeiban}>
              <SelectTrigger id="filter-dai-seiban" className="w-full">
                <SelectValue placeholder="全て表示" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て表示</SelectItem>
                {daiSeibanOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              const params = new URLSearchParams(window.location.search)
              if (filterDaiSeiban && filterDaiSeiban !== 'all') {
                params.set('dai_seiban', filterDaiSeiban)
              } else {
                params.delete('dai_seiban')
              }
              window.location.href = `${window.location.pathname}?${params.toString()}`
            }}
            className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600"
          >
            適用
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setFilterDaiSeiban("all")
              const filterDialog = document.getElementById('filter-dialog')
              if (filterDialog) {
                filterDialog.classList.add('hidden')
              }
            }}
          >
            リセット
          </Button>
        </div>
      </div>

      {/* 新規追加ダイアログ */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新規設備データ追加</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="B_id" className="text-right">
                製番
              </Label>
              <div className="col-span-3">
                <Input
                  id="B_id"
                  name="B_id"
                  value={newEquipment.B_id}
                  onChange={handleInputChange}
                  placeholder="例: 1100"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id_kind" className="text-right">
                ID種別
              </Label>
              <div className="col-span-3">
                <Input
                  id="id_kind"
                  name="id_kind"
                  value={newEquipment.id_kind}
                  onChange={handleInputChange}
                  placeholder="例: 2桁製番"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setsubi_name" className="text-right">
                設備名
              </Label>
              <div className="col-span-3">
                <Input
                  id="setsubi_name"
                  name="setsubi_name"
                  value={newEquipment.setsubi_name}
                  onChange={handleInputChange}
                  placeholder="例: 本体設備"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="setsubi_english_name" className="text-right">
                設備名（英語）
              </Label>
              <div className="col-span-3">
                <Input
                  id="setsubi_english_name"
                  name="setsubi_english_name"
                  value={newEquipment.setsubi_english_name}
                  onChange={handleInputChange}
                  placeholder="例: Main Equipment"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleAddEquipment}
              disabled={isLoading}
            >
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 