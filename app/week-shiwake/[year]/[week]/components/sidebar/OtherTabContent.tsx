"use client"
import { useState } from "react"

type OtherTabContentProps = {
  selectedEvent: any
  updateEvent: (updatedEvent: any) => void
  selectedOtherSubTab: string
  setSelectedOtherSubTab: ((subTab: string) => void) | undefined
}

export const OtherTabContent = ({ 
  selectedEvent, 
  updateEvent,
  selectedOtherSubTab,
  setSelectedOtherSubTab
}: OtherTabContentProps) => {
  // サブタブが変更されたときに、イベントも更新
  const handleSubTabChange = (subTab: string) => {
    if (setSelectedOtherSubTab) {
      setSelectedOtherSubTab(subTab)
    }
    updateEvent({ ...selectedEvent, otherSubTab: subTab })
  }

  return (
    <>
      {/* サブタブ切り替え - メインタブと同じスタイル */}
      {/* サブタブはWeekSidebarで表示するため、ここでは非表示にする */}

      {/* 出張のコンテンツ */}
      {selectedOtherSubTab === "出張" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">出張先</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "現場調査", code: "O201" },
                { name: "製造外注品検査・工場試運転対応", code: "O202" },
                { name: "現地試運転立会", code: "O203" },
                { name: "現地試運転ＳＶ", code: "O204" },
                { name: "現地3Dスキャン対応", code: "O205" },
                { name: "現地工事立会", code: "O206" },
                { name: "工事設計連絡員業務", code: "O207" },
                { name: "試運転基地対応業務", code: "O208" },
                { name: "その他", code: "O209" },
              ].map((type) => (
                <button
                  key={type.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    selectedEvent?.travelType === type.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    updateEvent({
                      ...selectedEvent,
                      travelType: type.name,
                      activityCode: type.code,
                      businessCode: type.code,
                    })
                  }}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 〇対応のコンテンツ */}
      {selectedOtherSubTab === "〇対応" && (
        <>
          <div className="border-b">
            <div className="px-4 py-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">対応先</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "プロ管", code: "O001" },
                  { name: "工事", code: "O002" },
                  { name: "製造", code: "O003" },
                  { name: "制御（電計）", code: "O004" },
                  { name: "製鉄所", code: "O005" },
                  { name: "PFC", code: "O006" },
                  { name: "土建", code: "O007" },
                  { name: "NSE_構造設計", code: "O008" },
                  { name: "NSE_CAESOL", code: "O009" },
                  { name: "（ベンダー）", code: "O00A" },
                  { name: "設計　その他", code: "O00B" },
                ].map((type) => (
                  <button
                    key={type.name}
                    className={`px-3 py-1.5 rounded-full text-xs ${
                      selectedEvent?.stakeholderType === type.name
                        ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      updateEvent({
                        ...selectedEvent,
                        stakeholderType: type.name,
                        activityCode: type.code,
                        businessCode: type.code,
                      })
                    }}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 業務分類コード表示 - WeekSidebarに移動済み */}
        </>
      )}

      {/* プロ管理のコンテンツ */}
      {selectedOtherSubTab === "プロ管理" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">プロ管理</label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "報告書作成および報告", code: "O301" },
                { name: "議事録の作成（対客先・社内）", code: "O302" },
                { name: "トラブル分析・D/A分析", code: "O303" },
                { name: "プロジェクト引継ぎ会議", code: "O304" },
                { name: "仕掛作成", code: "O305" },
                { name: "その他", code: "O306" },
              ].map((type) => (
                <button
                  key={type.name}
                  className={`px-3 py-1.5 rounded-full text-xs ${
                    selectedEvent?.documentType === type.name
                      ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300"
                      : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    updateEvent({
                      ...selectedEvent,
                      documentType: type.name,
                      activityCode: type.code,
                      businessCode: type.code,
                    })
                  }}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 資料サブタブのコンテンツ */}
      {selectedOtherSubTab === "資料" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">資料</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedEvent?.documentMaterial || ""}
              onChange={(e) => {
                // 選択された値からコードを生成
                const newValue = e.target.value;
                const code = newValue ? `O4${newValue}` : "";
                
                updateEvent({
                  ...selectedEvent,
                  documentMaterial: newValue,
                  activityCode: code,
                  businessCode: code,
                })
              }}
            >
              <option value="">選択してください</option>
              <option value="01">議事録作成</option>
              <option value="02">基礎荷重条件図</option>
              <option value="03">基礎ボルト配置図</option>
              <option value="04">ビルディングデータ？荷重条件、孔明図</option>
              <option value="05">ユーテリティTOP 位置</option>
              <option value="06">ユーテリティリスト</option>
              <option value="07">鋼材手配</option>
              <option value="08">電気品リスト</option>
              <option value="09">電源容量</option>
              <option value="10">運転方案書</option>
              <option value="11">インターフェースリスト</option>
              <option value="12">現地試運転要領書</option>
              <option value="13">取扱説明書</option>
              <option value="14">潤滑表</option>
              <option value="15">予備品消耗品リスト</option>
              <option value="16">試運転予備推奨品リスト</option>
              <option value="17">完成図書アズビルト</option>
              <option value="18">機械安全対応</option>
              <option value="19">特許調査</option>
              <option value="20">アスベスト調査</option>
              <option value="21">流用更新範囲図作成</option>
              <option value="22">官検・官庁申請書類</option>
              <option value="23">その他</option>
            </select>
          </div>
        </div>
      )}

      {/* その他のコンテンツ */}
      {selectedOtherSubTab === "その他" && (
        <div className="border-b">
          <div className="px-4 py-2">
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-xs font-bold text-gray-700">その他の業務 (O400)</p>
              <p className="text-xs text-gray-500 mt-1">その他の業務を記録します。内容を詳細に記入してください。</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 