"use client"

import { useState, useRef } from "react"
import { Save, RefreshCw, Database, Upload, Download, FileUp, Table, FileCode } from "lucide-react"

export default function SystemSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isExportingSchema, setIsExportingSchema] = useState(false)
  const [isImportingSchema, setIsImportingSchema] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [importResults, setImportResults] = useState([])
  const fileInputRef = useRef(null)
  const schemaFileInputRef = useRef(null)
  const [settings, setSettings] = useState({
    dataRetentionPeriod: "365",
    backupFrequency: "daily",
    enableNotifications: true,
    debugMode: false,
  })

  // フォームの入力値を更新
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // フォームの送信
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // ここでAPIを呼び出してシステム設定を更新
      // 実際のAPIエンドポイントは実装されていないため、成功したと仮定
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 保存処理のシミュレーション

      setMessage({ type: "success", text: "システム設定が正常に更新されました" })
    } catch (error) {
      console.error("システム設定の更新に失敗しました:", error)
      setMessage({ type: "error", text: "システム設定の更新に失敗しました" })
    } finally {
      setIsSaving(false)
    }
  }

  // データベースバックアップ
  const handleBackupDatabase = async () => {
    setMessage({ type: "", text: "" })

    try {
      // ここでAPIを呼び出してデータベースバックアップを実行
      // 実際のAPIエンドポイントは実装されていないため、成功したと仮定
      await new Promise((resolve) => setTimeout(resolve, 2000)) // バックアップ処理のシミュレーション

      setMessage({ type: "success", text: "データベースのバックアップが正常に完了しました" })
    } catch (error) {
      console.error("データベースバックアップに失敗しました:", error)
      setMessage({ type: "error", text: "データベースバックアップに失敗しました" })
    }
  }

  // DB初期化処理
  const handleInitDB = async () => {
    if (!confirm("データベースを初期化しますか？この操作は元に戻せません。")) {
      return
    }

    setMessage({ type: "", text: "" })
    try {
      const response = await fetch("/api/db/init")
      const data = await response.json()
      if (data.success) {
        setMessage({ type: "success", text: "データベースが初期化されました" })
      } else {
        setMessage({ type: "error", text: "エラー: " + data.message })
      }
    } catch (error) {
      console.error("データベース初期化中にエラーが発生しました:", error)
      setMessage({ type: "error", text: "データベース初期化中にエラーが発生しました" })
    }
  }

  // データベースをExcelにエクスポート
  const handleExportToExcel = async () => {
    setIsExporting(true)
    setMessage({ type: "", text: "" })

    try {
      // APIエンドポイントを呼び出してExcelファイルをダウンロード
      const response = await fetch("/api/db/export")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "エクスポートに失敗しました")
      }

      // ファイルをダウンロード
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")

      // 現在の日時を取得してファイル名に使用
      const now = new Date()
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now
        .getDate()
        .toString()
        .padStart(2, "0")}_${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`

      a.href = url
      a.download = `db_export_${timestamp}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setMessage({ type: "success", text: "データベースのエクスポートが完了しました" })
    } catch (error) {
      console.error("データベースのエクスポート中にエラーが発生しました:", error)
      setMessage({ type: "error", text: `エクスポート中にエラーが発生しました: ${error.message}` })
    } finally {
      setIsExporting(false)
    }
  }

  // ファイル選択ダイアログを開く
  const handleSelectFile = () => {
    fileInputRef.current.click()
  }

  // Excelファイルからデータをインポート
  const handleImportFromExcel = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // ファイル形式の確認
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setMessage({ type: "error", text: "Excelファイル(.xlsx, .xls)を選択してください" })
      return
    }

    if (!confirm("Excelファイルからデータをインポートしますか？既存のデータは上書きされます。")) {
      e.target.value = null // ファイル選択をリセット
      return
    }

    setIsImporting(true)
    setMessage({ type: "", text: "" })
    setImportResults([])

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/db/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: data.message })
        setImportResults(data.results || [])
      } else {
        setMessage({ type: "error", text: `インポートエラー: ${data.message}` })
      }
    } catch (error) {
      console.error("データベースのインポート中にエラーが発生しました:", error)
      setMessage({ type: "error", text: `インポート中にエラーが発生しました: ${error.message}` })
    } finally {
      setIsImporting(false)
      e.target.value = null // ファイル選択をリセット
    }
  }

  // スキーマをExcelにエクスポート
  const handleExportSchemaToExcel = async () => {
    setIsExportingSchema(true)
    setMessage({ type: "", text: "" })

    try {
      // APIエンドポイントを呼び出してExcelファイルをダウンロード
      const response = await fetch("/api/db/schema/export")

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "スキーマのエクスポートに失敗しました")
      }

      // ファイルをダウンロード
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")

      // 現在の日時を取得してファイル名に使用
      const now = new Date()
      const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now
        .getDate()
        .toString()
        .padStart(2, "0")}_${now.getHours().toString().padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`

      a.href = url
      a.download = `db_schema_${timestamp}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setMessage({ type: "success", text: "データベーススキーマのエクスポートが完了しました" })
    } catch (error) {
      console.error("スキーマのエクスポート中にエラーが発生しました:", error)
      setMessage({ type: "error", text: `スキーマのエクスポート中にエラーが発生しました: ${error.message}` })
    } finally {
      setIsExportingSchema(false)
    }
  }

  // スキーマファイル選択ダイアログを開く
  const handleSelectSchemaFile = () => {
    schemaFileInputRef.current.click()
  }

  // Excelファイルからスキーマをインポート
  const handleImportSchemaFromExcel = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // ファイル形式の確認
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setMessage({ type: "error", text: "Excelファイル(.xlsx, .xls)を選択してください" })
      return
    }

    if (!confirm("Excelファイルからスキーマをインポートしますか？テーブル構造が変更される可能性があります。")) {
      e.target.value = null // ファイル選択をリセット
      return
    }

    setIsImportingSchema(true)
    setMessage({ type: "", text: "" })
    setImportResults([])

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/db/schema/import", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: "success", text: data.message })
        setImportResults(data.results || [])
      } else {
        setMessage({ type: "error", text: `スキーマのインポートエラー: ${data.message}` })
      }
    } catch (error) {
      console.error("スキーマのインポート中にエラーが発生しました:", error)
      setMessage({ type: "error", text: `スキーマのインポート中にエラーが発生しました: ${error.message}` })
    } finally {
      setIsImportingSchema(false)
      e.target.value = null // ファイル選択をリセット
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">システム設定</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <form onSubmit={handleSubmit}>
          {message.text && (
            <div
              className={`p-4 mb-6 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">データ保持期間（日）</label>
              <input
                type="number"
                name="dataRetentionPeriod"
                className="w-full p-2 border rounded"
                value={settings.dataRetentionPeriod}
                onChange={handleInputChange}
                min="30"
                max="3650"
              />
              <p className="text-xs text-gray-500 mt-1">30日〜3650日（10年）の間で設定してください</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">バックアップ頻度</label>
              <select
                name="backupFrequency"
                className="w-full p-2 border rounded"
                value={settings.backupFrequency}
                onChange={handleInputChange}
              >
                <option value="hourly">毎時</option>
                <option value="daily">毎日</option>
                <option value="weekly">毎週</option>
                <option value="monthly">毎月</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">通知を有効にする</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">システム通知を有効にします</p>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="debugMode"
                  checked={settings.debugMode}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-gray-700">デバッグモード</span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">詳細なログを出力します（開発者向け）</p>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* データベース管理セクション */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">データベース管理</h2>

        {/* データエクスポート/インポートセクション */}
        <div className="mb-6 border-b pb-6">
          <h3 className="text-md font-medium mb-3">データエクスポート/インポート</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center gap-2 hover:bg-green-700"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  エクスポート中...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Excelにエクスポート
                </>
              )}
            </button>

            <button
              onClick={handleSelectFile}
              className="px-4 py-2 bg-orange-600 text-white rounded-md flex items-center gap-2 hover:bg-orange-700"
              disabled={isImporting}
            >
              {isImporting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  インポート中...
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4" />
                  Excelからインポート
                </>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFromExcel}
              accept=".xlsx,.xls"
              className="hidden"
            />
          </div>

          <p className="text-sm text-gray-500">
            エクスポート: 現在のデータベースの内容をExcelファイルとしてダウンロードします。
            <br />
            インポート: Excelファイルからデータを読み込み、データベースを更新します。既存のデータは上書きされます。
          </p>

          {/* インポート結果の表示 */}
          {importResults.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">インポート結果:</h4>
              <div className="max-h-60 overflow-y-auto border rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        テーブル
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        メッセージ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {importResults.map((result, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{result.table}</td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              result.status === "success"
                                ? "bg-green-100 text-green-800"
                                : result.status === "error"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {result.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">{result.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* スキーマエクスポート/インポートセクション */}
        <div className="mb-6 border-b pb-6">
          <h3 className="text-md font-medium mb-3">テーブル定義管理</h3>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <button
              onClick={handleExportSchemaToExcel}
              className="px-4 py-2 bg-purple-600 text-white rounded-md flex items-center gap-2 hover:bg-purple-700"
              disabled={isExportingSchema}
            >
              {isExportingSchema ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  エクスポート中...
                </>
              ) : (
                <>
                  <Table className="h-4 w-4" />
                  テーブル定義をエクスポート
                </>
              )}
            </button>

            <button
              onClick={handleSelectSchemaFile}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 hover:bg-indigo-700"
              disabled={isImportingSchema}
            >
              {isImportingSchema ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  インポート中...
                </>
              ) : (
                <>
                  <FileCode className="h-4 w-4" />
                  テーブル定義をインポート
                </>
              )}
            </button>
            <input
              type="file"
              ref={schemaFileInputRef}
              onChange={handleImportSchemaFromExcel}
              accept=".xlsx,.xls"
              className="hidden"
            />
          </div>

          <p className="text-sm text-gray-500">
            テーブル定義エクスポート: 現在のデータベースのテーブル構造をExcelファイルとしてダウンロードします。
            <br />
            テーブル定義インポート:
            Excelファイルからテーブル定義を読み込み、データベース構造を更新します。テーブルの追加や変更が可能です。
          </p>
        </div>

        {/* その他のデータベース操作 */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleBackupDatabase}
              className="px-4 py-2 bg-gray-600 text-white rounded-md flex items-center gap-2 hover:bg-gray-700"
            >
              <Database className="h-4 w-4" />
              データベースバックアップ
            </button>
            <button
              onClick={handleInitDB}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600"
            >
              <Upload className="h-4 w-4" />
              DB初期化
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            注意: DB初期化はすべてのデータを削除し、データベースを初期状態に戻します。この操作は元に戻せません。
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">システム情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">アプリケーションバージョン</p>
            <p className="font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">データベースバージョン</p>
            <p className="font-medium">SQLite 3.36.0</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">最終バックアップ日時</p>
            <p className="font-medium">2023-04-15 14:30:00</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">データベースサイズ</p>
            <p className="font-medium">12.4 MB</p>
          </div>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md flex items-center gap-2 hover:bg-gray-300">
            <RefreshCw className="h-4 w-4" />
            システム情報を更新
          </button>
        </div>
      </div>
    </div>
  )
}
