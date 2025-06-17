"use client"

type MeetingTabContentProps = {
  selectedEvent: any
  updateEvent: (updatedEvent: any) => void
}

export const MeetingTabContent = ({ selectedEvent, updateEvent }: MeetingTabContentProps) => {
  // サブタブに基づく3桁目の文字を設定
  const getThirdChar = (subTabType: string | undefined) => {
    switch(subTabType) {
      case "内部定例": return "N";
      case "外部定例": return "G";
      case "プロ進行": return "J";
      case "その他": return "O";
      default: return "0";
    }
  };

  return (
    <>
      <div className="border-b">
        <div className="px-4 py-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">会議種類</label>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "定例会", code: "01" },
              { name: "実行方針会議", code: "02" },
              { name: "全体品質会議", code: "03" },
              { name: "個別品質会議", code: "04" },
              { name: "部分品質会議", code: "05" },
              { name: "試運転計画会議", code: "06" },
              { name: "試運転安全審査", code: "07" },
              { name: "完成報告", code: "08" },
              { name: "その他", code: "09" },
            ].map((type) => (
              <button
                key={type.name}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  selectedEvent?.meetingType === type.name
                    ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                    : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                }`}
                onClick={() => {
                  // 業務分類コードを生成
                  // 1文字目: M（会議タブ）
                  // 3文字目: サブタブに基づく（内部定例=N、外部定例=G、プロ進行=J、その他=O）
                  // 下二桁: 選択された会議種類の数値
                  const thirdChar = getThirdChar(selectedEvent?.subTabType);
                  const code = `M${thirdChar}${type.code}`;
                  
                  updateEvent({
                    ...selectedEvent,
                    meetingType: type.name,
                    meetingCode: type.code, // 会議コードを保存
                    activityCode: code,
                    businessCode: code, // businessCodeにも設定
                  })
                }}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 選択されたサブタブとミーティングタイプの説明 */}
      {selectedEvent?.meetingType && selectedEvent?.subTabType && (
        <div className="border-b">
          <div className="px-4 py-2">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-xs font-bold text-gray-700">
                {selectedEvent.subTabType} - {selectedEvent.meetingType} 
                {selectedEvent.activityCode && ` (${selectedEvent.activityCode})`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedEvent.subTabType === "内部定例" && "部内で行われる定期的な会議です。"}
                {selectedEvent.subTabType === "外部定例" && "社外関係者と行われる定期的な会議です。"}
                {selectedEvent.subTabType === "プロ進行" && "プロジェクトの進行に関する会議です。"}
                {selectedEvent.subTabType === "その他" && "その他の会議です。"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* コードの表示部分があれば削除し、WeekSidebarに移動したことを示すコメントを追加 */}
      {/* 業務分類コード表示はWeekSidebarに移動済み */}

      {selectedEvent?.meetingType && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">会議フェーズ</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "会議準備", code: "C10" },
                { name: "会議", code: "C11" },
                { name: "会議後業務", code: "C12" },
              ].map((phase) => (
                <button
                  key={phase.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    selectedEvent?.meetingPhase === phase.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    // Combine the phase code with the meeting type code
                    const baseCode = phase.name === "会議準備" ? "C10" : phase.name === "会議" ? "C11" : "C12"
                    const typeCode =
                      selectedEvent.meetingType === "定例会"
                        ? "1"
                        : selectedEvent.meetingType === "実行方針会議"
                          ? "2"
                          : selectedEvent.meetingType === "全体品質会議"
                            ? "3"
                            : selectedEvent.meetingType === "個別品質会議"
                              ? "4"
                              : selectedEvent.meetingType === "部分品質会議"
                                ? "5"
                                : selectedEvent.meetingType === "試運転計画会議"
                                  ? "C"
                                  : selectedEvent.meetingType === "試運転安全審査"
                                    ? "D"
                                    : selectedEvent.meetingType === "完成報告"
                                      ? "E"
                                      : "F"
                    const fullCode = `${baseCode}${typeCode}`

                    updateEvent({
                      ...selectedEvent,
                      meetingPhase: phase.name,
                      activityCode: fullCode,
                      businessCode: fullCode, // businessCodeにも設定
                    })
                  }}
                >
                  {phase.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Only show meeting name input when "その他" is selected */}
      {selectedEvent?.meetingType === "その他" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">会議名</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-sm"
              value={selectedEvent?.meetingName || ""}
              placeholder="会議名を入力"
              onChange={(e) => {
                updateEvent({
                  ...selectedEvent,
                  meetingName: e.target.value,
                })
              }}
            />
          </div>
        </div>
      )}

      {/* 会議場所 */}
      <div className="border-b">
        <div className="px-4 py-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">会議場所</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-sm"
            value={selectedEvent?.meetingLocation || ""}
            placeholder="会議室名または場所"
            onChange={(e) => {
              updateEvent({
                ...selectedEvent,
                meetingLocation: e.target.value,
              })
            }}
          />
        </div>
      </div>
    </>
  )
}
