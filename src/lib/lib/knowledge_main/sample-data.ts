import type { Document } from "./types"

// サンプルデータの生成
export function generateSampleData(): { knowledgeList: string[]; documents: Document[] } {
  const knowledgeList = ["ねじ締結"]
  const documents: Document[] = []

  // 部門名のサンプル
  const departments = ["高炉", "製鋼", "CDQ", "圧延・広範処理", "開発"]
  // 資料種類のサンプル
  const documentTypes = ["技術マニュアル", "検討書", "報告書", "計算書", "論文", "参考資料", "作業手順書"]
  // プロジェクト名のサンプル
  const projects = ["A開発", "B改修", "機器開発", "航空機部品設計", "AI開発", "ロボット開発"]
  // 設備名のサンプル
  const equipments = ["ねじ締め機", "圧力容器", "組立機", "検査装置", "測定器", "試験機"]
  // 作成者のサンプル
  const creators = ["田中太郎", "鈴木一郎", "佐藤健太", "山田花子", "伊藤誠", "高橋実", "渡辺和子"]
  // コメントのサンプル
  const comments = [
    "重要な参考資料です。新人教育に使用してください。",
    "過去の失敗事例を含む貴重な資料です。",
    "最新の技術情報が含まれています。",
    "社内標準として承認済みの資料です。",
    "関連資料はREF-XXXを参照してください。",
    "定期的な見直しが必要です。",
    "プロジェクト完了後の振り返り資料です。",
    "",
  ]

  // LEVEL1の資料（教科書・参考資料）- 約30個
  for (let i = 1; i <= 30; i++) {
    const docId = `DOC-L1-${String(i).padStart(3, "0")}`
    // いいね数をランダムに設定（0〜50）
    const likeCount = Math.floor(Math.random() * 51)
    // コメントをランダムに設定
    const comment = comments[i % comments.length]

    documents.push({
      docuId: docId,
      name: `ねじ締結の基礎知識 ${i}`,
      knowledgeType: "ねじ締結",
      documentType: documentTypes[i % documentTypes.length],
      departmentName: departments[i % departments.length],
      creationYear: String(2015 + (i % 8)),
      creator: creators[i % creators.length],
      projectName: i % 3 === 0 ? projects[i % projects.length] : "",
      equipmentName: i % 4 === 0 ? equipments[i % equipments.length] : "",
      referenceId: i % 5 === 0 ? `REF-${i * 10}` : "",
      storageLocation: `サーバー${1 + (i % 3)}`,
      storageId: `S${i * 11}`,
      level: "LEVEL1",
      likeCount: likeCount,
      comment: comment,
    })
  }

  // LEVEL2の資料（代表計算書）- 約40個
  for (let i = 1; i <= 40; i++) {
    const docId = `DOC-L2-${String(i).padStart(3, "0")}`
    const dept = departments[i % departments.length]
    // いいね数をランダムに設定（0〜30）
    const likeCount = Math.floor(Math.random() * 31)
    // コメントをランダムに設定
    const comment = comments[(i + 2) % comments.length]

    documents.push({
      docuId: docId,
      name: `${dept}向けねじ締結計算書 ${i}`,
      knowledgeType: "ねじ締結",
      documentType: "計算書",
      departmentName: dept,
      creationYear: String(2018 + (i % 5)),
      creator: creators[i % creators.length],
      projectName: projects[i % projects.length],
      equipmentName: equipments[i % equipments.length],
      referenceId: `REF-CALC-${i * 5}`,
      storageLocation: `計算書サーバー${1 + (i % 2)}`,
      storageId: `C${i * 7}`,
      level: "LEVEL2",
      likeCount: likeCount,
      comment: comment,
    })
  }

  // LEVEL3の資料（過去実績資料）- 約30個
  for (let i = 1; i <= 30; i++) {
    const docId = `DOC-L3-${String(i).padStart(3, "0")}`
    const year = 2015 + (i % 8)
    const proj = projects[i % projects.length]
    // いいね数をランダムに設定（0〜20）
    const likeCount = Math.floor(Math.random() * 21)
    // コメントをランダムに設定
    const comment = comments[(i + 4) % comments.length]

    documents.push({
      docuId: docId,
      name: `${year}年 ${proj} ねじ締結実績報告`,
      knowledgeType: "ねじ締結",
      documentType: "実績報告書",
      departmentName: departments[i % departments.length],
      creationYear: String(year),
      creator: creators[i % creators.length],
      projectName: proj,
      equipmentName: equipments[i % equipments.length],
      referenceId: `REF-HIST-${i * 3}`,
      storageLocation: `実績サーバー${1 + (i % 4)}`,
      storageId: `H${i * 9}`,
      level: "LEVEL3",
      likeCount: likeCount,
      comment: comment,
    })
  }

  return { knowledgeList, documents }
}

