export const mockData = {
  members: [
    { id: 1, name: "鈴木 一郎", role: "プロマネ", avatar: "S" },
    { id: 2, name: "佐藤 二郎", role: "エンジニア", avatar: "B" },
    { id: 3, name: "田中 三郎", role: "設計", avatar: "T" },
    { id: 4, name: "高橋 四郎", role: "工事", avatar: "T" },
  ],
  schedules: [
    { id: 1, date: "2025/05/10", title: "キックオフミーティング" },
    { id: 2, date: "2025/05/15", title: "基本設計レビュー" },
    { id: 3, date: "2025/05/22", title: "詳細設計レビュー" },
    { id: 4, date: "2025/06/01", title: "製造開始" },
    { id: 5, date: "2025/06/10", title: "工事開始" },
    { id: 6, date: "2025/06/20", title: "中間報告会" },
  ],
  meetings: [
    { id: 1, date: "2025/05/08", title: "事前準備会議" },
    { id: 2, date: "2025/05/10", title: "キックオフ議事録" },
    { id: 3, date: "2025/05/17", title: "週次進捗会議" },
    { id: 4, date: "2025/05/24", title: "設計レビュー議事録" },
    { id: 5, date: "2025/05/31", title: "週次進捗会議" },
  ],
  tasks: [
    { id: 1, name: "基本設計書作成", dueDate: "3" },
    { id: 2, name: "詳細設計書作成", dueDate: "10" },
    { id: 3, name: "部品発注", dueDate: "5" },
    { id: 4, name: "工事計画書作成", dueDate: "7" },
    { id: 5, name: "テスト計画書作成", dueDate: "12" },
  ],
  fieldReports: [
    { id: 1, date: "2025/05/05", title: "現場確認レポート" },
    { id: 2, date: "2025/05/12", title: "横浜出張報告" },
    { id: 3, date: "2025/05/19", title: "大阪出張報告" },
    { id: 4, date: "2025/05/26", title: "現場写真撮影" },
    { id: 5, date: "2025/06/02", title: "現場測量報告" },
  ],
  progressRate: 35, // プロジェクト進捗率（％）
  contractStatus: {
    signed: 2,
    pending: 1,
    negotiation: 1
  }
}; 