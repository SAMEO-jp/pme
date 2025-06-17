"use client"

import type { Document } from "./types"
import { generateSampleData } from "./sample-data"
import * as XLSX from "xlsx"

// XMLのキー
const KNOWLEDGE_XML_KEY = "knowledge-xml-data"

// XMLデータの初期化と読み込み
const initializeData = () => {
  if (typeof window === "undefined") return { knowledgeList: [], documents: [] }

  let xmlData = localStorage.getItem(KNOWLEDGE_XML_KEY)

  // データが存在しない場合はサンプルデータを生成
  if (!xmlData) {
    const { knowledgeList, documents } = generateSampleData()
    xmlData = convertToXml(knowledgeList, documents)
    localStorage.setItem(KNOWLEDGE_XML_KEY, xmlData)
  }

  return parseXmlData(xmlData)
}

// XMLデータをパース
const parseXmlData = (xmlData: string): { knowledgeList: string[]; documents: Document[] } => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlData, "text/xml")

    // ナレッジリストの取得
    const knowledgeElements = xmlDoc.getElementsByTagName("knowledge")
    const knowledgeList: string[] = []

    for (let i = 0; i < knowledgeElements.length; i++) {
      const name = knowledgeElements[i].getAttribute("name")
      if (name) knowledgeList.push(name)
    }

    // ドキュメントの取得
    const documentElements = xmlDoc.getElementsByTagName("document")
    const documents: Document[] = []

    for (let i = 0; i < documentElements.length; i++) {
      const doc = documentElements[i]
      const document: Document = {
        docuId: getElementTextContent(doc, "docuId"),
        name: getElementTextContent(doc, "name"),
        knowledgeType: getElementTextContent(doc, "knowledgeType"),
        documentType: getElementTextContent(doc, "documentType"),
        departmentName: getElementTextContent(doc, "departmentName"),
        creationYear: getElementTextContent(doc, "creationYear"),
        creator: getElementTextContent(doc, "creator"),
        projectName: getElementTextContent(doc, "projectName"),
        equipmentName: getElementTextContent(doc, "equipmentName"),
        referenceId: getElementTextContent(doc, "referenceId"),
        storageLocation: getElementTextContent(doc, "storageLocation"),
        storageId: getElementTextContent(doc, "storageId"),
        level: getElementTextContent(doc, "level"),
        likeCount: Number.parseInt(getElementTextContent(doc, "likeCount") || "0", 10),
        comment: getElementTextContent(doc, "comment") || "", // コメント欄を追加
      }
      documents.push(document)
    }

    return { knowledgeList, documents }
  } catch (error) {
    console.error("XMLのパースに失敗しました", error)
    return { knowledgeList: [], documents: [] }
  }
}

// 要素のテキストコンテンツを取得
const getElementTextContent = (parent: Element, tagName: string): string => {
  const element = parent.getElementsByTagName(tagName)[0]
  return element ? element.textContent || "" : ""
}

// XMLに変換
const convertToXml = (knowledgeList: string[], documents: Document[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n  <knowledgeList>\n'

  // ナレッジリスト
  knowledgeList.forEach((knowledge) => {
    xml += `    <knowledge name="${escapeXml(knowledge)}" />\n`
  })

  xml += "  </knowledgeList>\n  <documents>\n"

  // ドキュメント
  documents.forEach((doc) => {
    xml += "    <document>\n"
    xml += `      <docuId>${escapeXml(doc.docuId)}</docuId>\n`
    xml += `      <name>${escapeXml(doc.name)}</name>\n`
    xml += `      <knowledgeType>${escapeXml(doc.knowledgeType)}</knowledgeType>\n`
    xml += `      <documentType>${escapeXml(doc.documentType)}</documentType>\n`
    xml += `      <departmentName>${escapeXml(doc.departmentName)}</departmentName>\n`
    xml += `      <creationYear>${escapeXml(doc.creationYear)}</creationYear>\n`
    xml += `      <creator>${escapeXml(doc.creator)}</creator>\n`
    xml += `      <projectName>${escapeXml(doc.projectName)}</projectName>\n`
    xml += `      <equipmentName>${escapeXml(doc.equipmentName)}</equipmentName>\n`
    xml += `      <referenceId>${escapeXml(doc.referenceId)}</referenceId>\n`
    xml += `      <storageLocation>${escapeXml(doc.storageLocation)}</storageLocation>\n`
    xml += `      <storageId>${escapeXml(doc.storageId)}</storageId>\n`
    xml += `      <level>${escapeXml(doc.level)}</level>\n`
    xml += `      <likeCount>${doc.likeCount}</likeCount>\n`
    xml += `      <comment>${escapeXml(doc.comment || "")}</comment>\n` // コメント欄を追加
    xml += "    </document>\n"
  })

  xml += "  </documents>\n</data>"

  return xml
}

// 特定のナレッジのみのXMLに変換
const convertKnowledgeToXml = (knowledgeName: string, documents: Document[]): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n  <knowledgeList>\n'

  // ナレッジ
  xml += `    <knowledge name="${escapeXml(knowledgeName)}" />\n`

  xml += "  </knowledgeList>\n  <documents>\n"

  // ドキュメント（指定されたナレッジに関連するもののみ）
  documents
    .filter((doc) => doc.knowledgeType === knowledgeName)
    .forEach((doc) => {
      xml += "    <document>\n"
      xml += `      <docuId>${escapeXml(doc.docuId)}</docuId>\n`
      xml += `      <name>${escapeXml(doc.name)}</name>\n`
      xml += `      <knowledgeType>${escapeXml(doc.knowledgeType)}</knowledgeType>\n`
      xml += `      <documentType>${escapeXml(doc.documentType)}</documentType>\n`
      xml += `      <departmentName>${escapeXml(doc.departmentName)}</departmentName>\n`
      xml += `      <creationYear>${escapeXml(doc.creationYear)}</creationYear>\n`
      xml += `      <creator>${escapeXml(doc.creator)}</creator>\n`
      xml += `      <projectName>${escapeXml(doc.projectName)}</projectName>\n`
      xml += `      <equipmentName>${escapeXml(doc.equipmentName)}</equipmentName>\n`
      xml += `      <referenceId>${escapeXml(doc.referenceId)}</referenceId>\n`
      xml += `      <storageLocation>${escapeXml(doc.storageLocation)}</storageLocation>\n`
      xml += `      <storageId>${escapeXml(doc.storageId)}</storageId>\n`
      xml += `      <level>${escapeXml(doc.level)}</level>\n`
      xml += `      <likeCount>${doc.likeCount}</likeCount>\n`
      xml += `      <comment>${escapeXml(doc.comment || "")}</comment>\n` // コメント欄を追加
      xml += "    </document>\n"
    })

  xml += "  </documents>\n</data>"

  return xml
}

// XML特殊文字のエスケープ
const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// データの保存
const saveData = (knowledgeList: string[], documents: Document[]) => {
  if (typeof window === "undefined") return

  const xmlData = convertToXml(knowledgeList, documents)
  localStorage.setItem(KNOWLEDGE_XML_KEY, xmlData)
}

// ナレッジリストの取得
export async function getAllKnowledge(): Promise<string[]> {
  const { knowledgeList } = initializeData()
  return knowledgeList
}

// ナレッジの存在確認
export async function getKnowledgeByName(name: string): Promise<boolean> {
  const knowledgeList = await getAllKnowledge()
  return knowledgeList.includes(name)
}

// 新規ナレッジの作成
export async function createKnowledge(name: string): Promise<void> {
  const { knowledgeList, documents } = initializeData()

  if (!knowledgeList.includes(name)) {
    const updatedList = [...knowledgeList, name]
    saveData(updatedList, documents)
  }
}

// 全ての資料を取得
export async function getAllDocuments(): Promise<Document[]> {
  const { documents } = initializeData()
  return documents
}

// ナレッジとレベルに基づいて資料を取得
export async function getDocumentsByKnowledgeAndLevel(knowledgeName: string, level: string): Promise<Document[]> {
  const allDocuments = await getAllDocuments()

  return allDocuments.filter((doc) => doc.knowledgeType === knowledgeName && doc.level === level)
}

// 資料の追加
export async function addDocument(document: Document): Promise<void> {
  const { knowledgeList, documents } = initializeData()

  // いいね数が設定されていない場合は0に設定
  if (document.likeCount === undefined) {
    document.likeCount = 0
  }

  // コメントが設定されていない場合は空文字列に設定
  if (document.comment === undefined) {
    document.comment = ""
  }

  // 既存のドキュメントがあれば更新、なければ追加
  const existingIndex = documents.findIndex((doc) => doc.docuId === document.docuId)

  let updatedDocuments: Document[]
  if (existingIndex >= 0) {
    updatedDocuments = [...documents]
    updatedDocuments[existingIndex] = document
  } else {
    updatedDocuments = [...documents, document]
  }

  saveData(knowledgeList, updatedDocuments)

  // ナレッジが存在しない場合は作成
  if (!knowledgeList.includes(document.knowledgeType)) {
    await createKnowledge(document.knowledgeType)
  }
}

// 資料の削除
export async function deleteDocument(docuId: string): Promise<boolean> {
  const { knowledgeList, documents } = initializeData()

  const docIndex = documents.findIndex((doc) => doc.docuId === docuId)
  if (docIndex === -1) return false

  const updatedDocuments = documents.filter((doc) => doc.docuId !== docuId)
  saveData(knowledgeList, updatedDocuments)

  return true
}

// いいね数を更新
export async function updateLikeCount(docuId: string, increment = true): Promise<Document | null> {
  const { knowledgeList, documents } = initializeData()

  const docIndex = documents.findIndex((doc) => doc.docuId === docuId)
  if (docIndex === -1) return null

  const updatedDocuments = [...documents]
  const currentLikes = updatedDocuments[docIndex].likeCount || 0

  // いいね数を増減（最小値は0）
  updatedDocuments[docIndex].likeCount = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1)

  saveData(knowledgeList, updatedDocuments)

  return updatedDocuments[docIndex]
}

// 特定のナレッジのXMLデータをエクスポート
export async function exportKnowledgeXmlData(knowledgeName: string): Promise<string> {
  if (typeof window === "undefined") return ""

  const { documents } = initializeData()
  return convertKnowledgeToXml(knowledgeName, documents)
}

// 特定のナレッジのXMLデータをインポート
export async function importKnowledgeXmlData(knowledgeName: string, xmlData: string): Promise<boolean> {
  try {
    // XMLの検証
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlData, "text/xml")

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("無効なXMLデータです")
    }

    // 現在のデータを取得
    const { knowledgeList, documents } = initializeData()

    // インポートするデータを解析
    const importedData = parseXmlData(xmlData)

    // 指定されたナレッジに関連する既存のドキュメントを削除
    const filteredDocuments = documents.filter((doc) => doc.knowledgeType !== knowledgeName)

    // インポートするドキュメントを追加（指定されたナレッジに関連するもののみ）
    const importedDocuments = importedData.documents.filter((doc) => doc.knowledgeType === knowledgeName)
    const updatedDocuments = [...filteredDocuments, ...importedDocuments]

    // ナレッジリストを更新（まだ存在しない場合は追加）
    const updatedKnowledgeList = [...knowledgeList]
    if (!updatedKnowledgeList.includes(knowledgeName)) {
      updatedKnowledgeList.push(knowledgeName)
    }

    // 更新されたデータを保存
    saveData(updatedKnowledgeList, updatedDocuments)

    return true
  } catch (error) {
    console.error("XMLのインポートに失敗しました", error)
    return false
  }
}

// 全XMLデータをエクスポート
export async function exportXmlData(): Promise<string> {
  if (typeof window === "undefined") return ""

  const xmlData = localStorage.getItem(KNOWLEDGE_XML_KEY)
  return xmlData || ""
}

// 全XMLデータをインポート
export async function importXmlData(xmlData: string): Promise<boolean> {
  try {
    // XMLの検証
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlData, "text/xml")

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("無効なXMLデータです")
    }

    localStorage.setItem(KNOWLEDGE_XML_KEY, xmlData)
    return true
  } catch (error) {
    console.error("XMLのインポートに失敗しました", error)
    return false
  }
}

// Excelテンプレートまたはデータをエクスポート
export async function exportKnowledgeToExcel(knowledgeName: string, templateOnly = false): Promise<void> {
  if (typeof window === "undefined") return

  // 現在のデータを取得
  const { documents } = initializeData()

  // 指定されたナレッジに関連するドキュメントのみをフィルタリング
  const knowledgeDocuments = documents.filter((doc) => doc.knowledgeType === knowledgeName)

  // Excelワークブックを作成
  const wb = XLSX.utils.book_new()

  // ヘッダー行
  const headers = [
    "DocuID",
    "資料名",
    "ナレッジ種類",
    "資料種類",
    "商品部名",
    "作成年",
    "作成者",
    "プロジェクト名",
    "設備名",
    "参考資料ID",
    "保存場所",
    "保存ID",
    "LEVEL",
    "コメント",
  ]

  // データ行
  let rows: any[][] = []

  if (templateOnly) {
    // テンプレートモードの場合は、ヘッダーのみ（サンプル行を1行追加）
    rows = [
      [
        "DOC-001",
        "サンプル資料",
        knowledgeName,
        "技術マニュアル",
        "開発部",
        "2023",
        "山田太郎",
        "プロジェクトA",
        "設備X",
        "REF-001",
        "サーバー1",
        "S001",
        "LEVEL1",
        "サンプルコメント",
      ],
    ]
  } else {
    // データモードの場合は、実際のデータを追加
    rows = knowledgeDocuments.map((doc) => [
      doc.docuId,
      doc.name,
      doc.knowledgeType,
      doc.documentType,
      doc.departmentName,
      doc.creationYear,
      doc.creator,
      doc.projectName,
      doc.equipmentName,
      doc.referenceId,
      doc.storageLocation,
      doc.storageId,
      doc.level,
      doc.comment,
    ])
  }

  // ワークシートを作成
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])

  // 列幅の設定
  const wscols = headers.map(() => ({ wch: 20 })) // 各列の幅を20に設定
  ws["!cols"] = wscols

  // ワークブックにワークシートを追加
  XLSX.utils.book_append_sheet(wb, ws, "資料データ")

  // ファイル名を設定
  const fileName = templateOnly ? `${knowledgeName}-テンプレート.xlsx` : `${knowledgeName}-データ.xlsx`

  // ブラウザ環境でのファイルダウンロード処理
  // XLSX.writeFile の代わりに XLSX.write を使用して Blob を生成
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const blob = new Blob([wbout], { type: "application/octet-stream" })

  // ダウンロードリンクを作成
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  // クリーンアップ
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 0)
}

// Excelからデータをインポート
export async function importKnowledgeFromExcel(
  knowledgeName: string,
  file: File,
): Promise<{ success: boolean; count?: number; error?: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = XLSX.read(data, { type: "array" })

        // 最初のシートを取得
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]

        // シートのデータを配列に変換
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]

        // ヘッダー行を確認
        if (rows.length < 2) {
          return resolve({ success: false, error: "データが見つかりません。" })
        }

        const headers = rows[0] as string[]
        const requiredHeaders = ["DocuID", "資料名", "ナレッジ種類", "LEVEL"]

        // 必須ヘッダーが存在するか確認
        for (const header of requiredHeaders) {
          if (!headers.includes(header)) {
            return resolve({
              success: false,
              error: `必須ヘッダー「${header}」が見つかりません。正しいテンプレートを使用してください。`,
            })
          }
        }

        // 現在のデータを取得
        const { knowledgeList, documents } = initializeData()

        // 指定されたナレッジに関連する既存のドキュメントを削除
        const filteredDocuments = documents.filter((doc) => doc.knowledgeType !== knowledgeName)

        // 新しいドキュメントを作成
        const newDocuments: Document[] = []
        const dataRows = rows.slice(1) // ヘッダー行を除外

        for (const row of dataRows) {
          // 空行をスキップ
          if (!row[0]) continue

          const docuId = row[headers.indexOf("DocuID")]
          const name = row[headers.indexOf("資料名")]
          const level = row[headers.indexOf("LEVEL")]

          // 必須項目が空でないか確認
          if (!docuId || !name || !level) {
            continue // 必須項目が空の行はスキップ
          }

          // 新しいドキュメントを作成
          const newDoc: Document = {
            docuId,
            name,
            knowledgeType: knowledgeName, // 常に指定されたナレッジ種類を使用
            documentType: row[headers.indexOf("資料種類")] || "",
            departmentName: row[headers.indexOf("商品部名")] || "",
            creationYear: row[headers.indexOf("作成年")] || "",
            creator: row[headers.indexOf("作成者")] || "",
            projectName: row[headers.indexOf("プロジェクト名")] || "",
            equipmentName: row[headers.indexOf("設備名")] || "",
            referenceId: row[headers.indexOf("参考資料ID")] || "",
            storageLocation: row[headers.indexOf("保存場所")] || "",
            storageId: row[headers.indexOf("保存ID")] || "",
            level,
            likeCount: 0, // 新規インポート時はいいね数を0に設定
            comment: row[headers.indexOf("コメント")] || "",
          }

          newDocuments.push(newDoc)
        }

        if (newDocuments.length === 0) {
          return resolve({ success: false, error: "有効なデータが見つかりません。" })
        }

        // ナレッジリストを更新（まだ存在しない場合は追加）
        const updatedKnowledgeList = [...knowledgeList]
        if (!updatedKnowledgeList.includes(knowledgeName)) {
          updatedKnowledgeList.push(knowledgeName)
        }

        // 更新されたデータを保存
        const updatedDocuments = [...filteredDocuments, ...newDocuments]
        saveData(updatedKnowledgeList, updatedDocuments)

        resolve({ success: true, count: newDocuments.length })
      } catch (error) {
        console.error("Excelのインポートに失敗しました", error)
        reject(error)
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

