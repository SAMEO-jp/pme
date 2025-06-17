"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { exportXmlData, importXmlData } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export function DataManagement() {
  const [xmlData, setXmlData] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportXmlData()
      setXmlData(data)
      toast({
        title: "エクスポート成功",
        description: "XMLデータが正常にエクスポートされました。",
      })
    } catch (error) {
      console.error("エクスポートに失敗しました", error)
      toast({
        title: "エクスポート失敗",
        description: "XMLデータのエクスポートに失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!xmlData.trim()) {
      toast({
        title: "インポート失敗",
        description: "XMLデータが入力されていません。",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    try {
      const success = await importXmlData(xmlData)
      if (success) {
        toast({
          title: "インポート成功",
          description: "XMLデータが正常にインポートされました。ページを更新してください。",
        })
      } else {
        throw new Error("インポートに失敗しました")
      }
    } catch (error) {
      console.error("インポートに失敗しました", error)
      toast({
        title: "インポート失敗",
        description: "XMLデータのインポートに失敗しました。正しいXML形式か確認してください。",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleDownload = () => {
    if (!xmlData) {
      toast({
        title: "ダウンロード失敗",
        description: "XMLデータがありません。先にエクスポートしてください。",
        variant: "destructive",
      })
      return
    }

    const blob = new Blob([xmlData], { type: "text/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "knowledge-data.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? "エクスポート中..." : "XMLデータをエクスポート"}
        </Button>
        <Button onClick={handleDownload} variant="outline" disabled={!xmlData}>
          XMLファイルをダウンロード
        </Button>
      </div>

      <Textarea
        value={xmlData}
        onChange={(e) => setXmlData(e.target.value)}
        placeholder="XMLデータを入力またはエクスポートしたデータがここに表示されます"
        className="min-h-[200px] font-mono text-sm"
      />

      <div className="flex justify-end">
        <Button onClick={handleImport} disabled={isImporting}>
          {isImporting ? "インポート中..." : "XMLデータをインポート"}
        </Button>
      </div>
    </div>
  )
}

