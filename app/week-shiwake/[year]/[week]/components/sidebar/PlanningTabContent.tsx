"use client"

import { useState, useEffect } from "react"

type PlanningTabContentProps = {
  selectedEvent: any
  updateEvent: (updatedEvent: any) => void
  selectedEquipment: string
}

export const PlanningTabContent = ({ selectedEvent, updateEvent, selectedEquipment }: PlanningTabContentProps) => {
  const [planningSubType, setPlanningSubType] = useState<string>("")
  const [estimateSubType, setEstimateSubType] = useState<string>("")

  // 選択されたイベントが変更されたときに状態を更新
  useEffect(() => {
    if (selectedEvent) {
      setPlanningSubType(selectedEvent.planningSubType || "")
      setEstimateSubType(selectedEvent.estimateSubType || "")
    }
  }, [selectedEvent])

  return (
    <>
      {/* 設備情報欄は削除 */}

      {/* 計画図が選択された場合のサブタイプ */}
      {selectedEvent?.subTabType === "計画図" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">計画図業務</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "作図及び作図準備", code: "02" },
                { name: "作図指示", code: "04" },
                { name: "検図", code: "07" },
                { name: "承認作業", code: "08" },
                { name: "出図前図面検討会", code: "03" },
                { name: "出図後図面検討会", code: "06" },
                { name: "その他", code: "09" },
              ].map((subType) => (
                <button
                  key={subType.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    planningSubType === subType.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setPlanningSubType(subType.name)
                    
                    // 3桁目の文字を設定
                    const thirdChar = "P"; // 計画図用
                    
                    // 4桁コードを構成（P:計画 + P:計画図 + 選択した業務タイプの下二桁）
                    const newCode = `PP${subType.code}`;
                    
                    updateEvent({
                      ...selectedEvent,
                      planningSubType: subType.name,
                      activityCode: newCode,
                      businessCode: newCode, // businessCodeにも設定
                    })
                  }}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 検討書が選択された場合の会議オプション */}
      {selectedEvent?.subTabType === "検討書" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-xs font-bold text-gray-700">検討書作成およびサイン (PC01)</p>
              <p className="text-xs text-gray-500 mt-1">検討書の作成と必要なサイン作業を行います。</p>
            </div>
          </div>
        </div>
      )}

      {/* 見積りが選択された場合のサブタイプ */}
      {selectedEvent?.subTabType === "見積り" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">見積り業務</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "設計費見積書", code: "01" },
                { name: "見積仕様書", code: "02" },
                { name: "テクスぺ", code: "03" },
                { name: "製作品BQ", code: "04" },
                { name: "工事BQ", code: "05" },
                { name: "購入品見積", code: "06" },
                { name: "区分見積", code: "07" },
                { name: "予備品見積", code: "08" },
                { name: "その他", code: "09" },
              ].map((subType) => (
                <button
                  key={subType.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    estimateSubType === subType.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setEstimateSubType(subType.name)
                    
                    // 3桁目の文字を設定
                    const thirdChar = "T"; // 見積り用
                    
                    // 4桁コードを構成（P:計画 + T:見積り + 選択した業務タイプの下二桁）
                    const newCode = `PT${subType.code}`;
                    
                    updateEvent({
                      ...selectedEvent,
                      estimateSubType: subType.name,
                      activityCode: newCode,
                      businessCode: newCode, // businessCodeにも設定
                    })
                  }}
                >
                  {subType.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 業務分類コード表示はWeekSidebarに移動済み */}
    </>
  )
}
