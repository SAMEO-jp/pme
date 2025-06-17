"use client"

type IndirectTabContentProps = {
  selectedEvent: any
  updateEvent: (updatedEvent: any) => void
  indirectSubTab: string
  selectedIndirectDetailTab: string
  purposeProjectCode?: string
}

export const IndirectTabContent = ({ 
  selectedEvent, 
  updateEvent, 
  indirectSubTab, 
  selectedIndirectDetailTab,
  purposeProjectCode
}: IndirectTabContentProps) => {
  return (
    <div>
      {/* 純間接の場合 */}
      {indirectSubTab === "純間接" && (
        <div className="mb-4 px-3">
          {selectedIndirectDetailTab === "会議" && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">会議タイプ</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedEvent?.meetingType || ""}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, meetingType: e.target.value })
                }}
              >
                <option value="">選択してください</option>
                <option value="定例会議">定例会議</option>
                <option value="臨時会議">臨時会議</option>
                <option value="報告会">報告会</option>
                <option value="オンライン会議">オンライン会議</option>
                <option value="その他">その他</option>
              </select>
            </div>
          )}
          
          {selectedIndirectDetailTab === "人事評価" && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">評価タイプ</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedEvent?.evaluationType || ""}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, evaluationType: e.target.value })
                }}
              >
                <option value="">選択してください</option>
                <option value="目標設定">目標設定</option>
                <option value="中間レビュー">中間レビュー</option>
                <option value="年度評価">年度評価</option>
                <option value="部下面談">部下面談</option>
                <option value="その他">その他</option>
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* 目的間接の場合 */}
      {indirectSubTab === "目的間接" && (
        <div className="mb-4 px-3">          
          {selectedIndirectDetailTab === "会議" && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">会議タイプ</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedEvent?.meetingType || ""}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, meetingType: e.target.value })
                }}
              >
                <option value="">選択してください</option>
                <option value="定例会議">定例会議</option>
                <option value="臨時会議">臨時会議</option>
                <option value="報告会">報告会</option>
                <option value="オンライン会議">オンライン会議</option>
                <option value="その他">その他</option>
              </select>
            </div>
          )}
          
          {selectedIndirectDetailTab === "作業" && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">作業タイプ</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedEvent?.workType || ""}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, workType: e.target.value })
                }}
              >
                <option value="">選択してください</option>
                <option value="書類作成">書類作成</option>
                <option value="資料調査">資料調査</option>
                <option value="データ解析">データ解析</option>
                <option value="研究活動">研究活動</option>
                <option value="その他">その他</option>
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* 控除時間の場合 */}
      {indirectSubTab === "控除時間" && (
    <div className="mb-4 px-3">
          {selectedIndirectDetailTab === "休憩／外出" && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">休憩タイプ</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedEvent?.breakType || ""}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, breakType: e.target.value })
                }}
              >
                <option value="">選択してください</option>
                <option value="昼休憩">昼休憩</option>
                <option value="休憩">休憩</option>
                <option value="私用外出">私用外出</option>
                <option value="その他">その他</option>
              </select>
            </div>
          )}
          
          {selectedIndirectDetailTab === "組合時間" && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">組合活動タイプ</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedEvent?.unionType || ""}
                onChange={(e) => {
                  updateEvent({ ...selectedEvent, unionType: e.target.value })
                }}
              >
                <option value="">選択してください</option>
                <option value="組合会議">組合会議</option>
                <option value="組合活動">組合活動</option>
                <option value="組合イベント">組合イベント</option>
                <option value="その他">その他</option>
              </select>
            </div>
          )}
          
          {selectedIndirectDetailTab === "その他" && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">控除理由</label>
      <select
        className="w-full p-2 border rounded"
                value={selectedEvent?.deductionReason || ""}
        onChange={(e) => {
                  updateEvent({ ...selectedEvent, deductionReason: e.target.value })
        }}
      >
        <option value="">選択してください</option>
                <option value="有給休暇">有給休暇</option>
                <option value="特別休暇">特別休暇</option>
                <option value="振替休日">振替休日</option>
                <option value="遅刻">遅刻</option>
                <option value="早退">早退</option>
        <option value="その他">その他</option>
      </select>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
