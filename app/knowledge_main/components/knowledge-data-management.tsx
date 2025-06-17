"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  exportKnowledgeXmlData,
  importKnowledgeXmlData,
  exportKnowledgeToExcel,
  importKnowledgeFromExcel,
} from "@/lib/knowledge_main/data"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, FileSpreadsheet, FileCode } from "lucide-react"

interface KnowledgeDataManagementProps {
  knowledgeName: string
}

export function KnowledgeDataManagement({ knowledgeName }: KnowledgeDataManagementProps) {
  const [xmlData, setXmlData] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  const [isImportingExcel, setIsImportingExcel] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const { toast } = useToast()

  // ファイル入力用のref
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // XMLエクスポート
  const handleXmlExport = async () => {
    setIsExporting(true)
    try {
      const data = await exportKnowledgeXmlData(knowledgeName)
      setXmlData(data)
      toast({
        title: "エクスポート成功",
        description: `「${knowledgeName}」のXMLデータが正常にエクスポートされました。`,
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

  // XMLインポート
  const handleXmlImport = async () => {
    if (!xmlData.trim()) {
      toast({
        title: "インポート失敗",
        description: "XMLデータが入力されていません。",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportError(null)
    try {
      const success = await importKnowledgeXmlData(knowledgeName, xmlData)
      if (success) {
        toast({
          title: "インポート成功",
          description: `「${knowledgeName}」のXMLデータが正常にインポートされました。ページを更新してください。`,
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
      setImportError("XMLデータのインポートに失敗しました。正しいXML形式か確認してください。")
    } finally {
      setIsImporting(false)
    }
  }

  // XMLダウンロード
  const handleXmlDownload = () => {
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
    a.download = `${knowledgeName}-data.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Excelテンプレートのダウンロード
  const handleExcelTemplateDownload = async () => {
    setIsExportingExcel(true)
    try {
      await exportKnowledgeToExcel(knowledgeName, true) // テンプレートモード
      toast({
        title: "テンプレート作成成功",
        description: `「${knowledgeName}」のExcelテンプレートが正常に作成されました。`,
      })
    } catch (error) {
      console.error("テンプレート作成に失敗しました", error)
      toast({
        title: "テンプレート作成失敗",
        description: "Excelテンプレートの作成に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsExportingExcel(false)
    }
  }

  // 現在のデータをExcelでダウンロード
  const handleExcelDataDownload = async () => {
    setIsExportingExcel(true)
    try {
      await exportKnowledgeToExcel(knowledgeName, false) // データモード
      toast({
        title: "Excel出力成功",
        description: `「${knowledgeName}」のデータがExcelに正常に出力されました。`,
      })
    } catch (error) {
      console.error("Excel出力に失敗しました", error)
      toast({
        title: "Excel出力失敗",
        description: "Excelデータの出力に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsExportingExcel(false)
    }
  }

  // Excelファイルのインポート処理
  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImportingExcel(true)
    setImportError(null)
    try {
      const result = await importKnowledgeFromExcel(knowledgeName, file)
      if (result.success) {
        toast({
          title: "インポート成功",
          description: `${result.count}件の資料データが正常にインポートされました。ページを更新してください。`,
        })
      } else {
        throw new Error(result.error || "インポートに失敗しました")
      }
    } catch (error: any) {
      console.error("Excelインポートに失敗しました", error)
      toast({
        title: "インポート失敗",
        description: error.message || "Excelデータのインポートに失敗しました。",
        variant: "destructive",
      })
      setImportError(error.message || "Excelデータのインポートに失敗しました。")
    } finally {
      setIsImportingExcel(false)
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // ファイル選択ダイアログを開く
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>「{knowledgeName}」のデータ管理</CardTitle>
          <CardDescription>
            このナレッジに関連する資料データをエクスポート・インポートできます。
            バックアップや他のシステムとのデータ連携にご利用ください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="excel">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="excel">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excelデータ
              </TabsTrigger>
              <TabsTrigger value="xml">
                <FileCode className="h-4 w-4 mr-2" />
                XMLデータ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="excel" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Excelテンプレート</CardTitle>
                    <CardDescription>
                      空のExcelテンプレートをダウンロードして、新しい資料データを入力できます。
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleExcelTemplateDownload} disabled={isExportingExcel} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {isExportingExcel ? "作成中..." : "テンプレートをダウンロード"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">現在のデータ</CardTitle>
                    <CardDescription>現在登録されている資料データをExcel形式でダウンロードできます。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleExcelDataDownload} disabled={isExportingExcel} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {isExportingExcel ? "出力中..." : "データをExcelで出力"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Excelデータのインポート</CardTitle>
                  <CardDescription>
                    Excelファイルから資料データを一括でインポートします。
                    テンプレートに沿って作成したExcelファイルをアップロードしてください。
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleExcelImport}
                  />
                  <Button onClick={openFileDialog} disabled={isImportingExcel} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    {isImportingExcel ? "インポート中..." : "Excelファイルをアップロード"}
                  </Button>

                  {importError && (
                    <Alert variant="destructive">
                      <AlertTitle>インポートエラー</AlertTitle>
                      <AlertDescription>{importError}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="xml" className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleXmlExport} disabled={isExporting}>
                  {isExporting ? "エクスポート中..." : "XMLデータをエクスポート"}
                </Button>
                <Button onClick={handleXmlDownload} variant="outline" disabled={!xmlData}>
                  XMLファイルをダウンロード
                </Button>
              </div>

              <Textarea
                value={xmlData}
                onChange={(e) => setXmlData(e.target.value)}
                placeholder="XMLデータを入力またはエクスポートしたデータがここに表示されます"
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex justify-end">
                <Button onClick={handleXmlImport} disabled={isImporting}>
                  {isImporting ? "インポート中..." : "XMLデータをインポート"}
                </Button>
              </div>

              {importError && (
                <Alert variant="destructive">
                  <AlertTitle>インポートエラー</AlertTitle>
                  <AlertDescription>{importError}</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

