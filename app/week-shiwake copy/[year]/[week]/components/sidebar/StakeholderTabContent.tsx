"use client"

type StakeholderTabContentProps = {
  selectedEvent: any
  updateEvent: (updatedEvent: any) => void
}

export const StakeholderTabContent = ({ selectedEvent, updateEvent }: StakeholderTabContentProps) => {
  return (
    <>
      <div className="mb-4 px-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">対応先</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { name: "試運転", code: "M009" },
            { name: "取説", code: "M00A" },
            { name: "製造", code: "M00B" },
            { name: "工事", code: "M00C" },
            { name: "制御", code: "M00D" },
            { name: "プロマネ", code: "M00E" },
            { name: "トラブル", code: "M00F" },
            { name: "その他", code: "M00G" },
          ].map((type) => (
            <button
              key={type.name}
              className={`px-3 py-1.5 rounded-full text-sm ${
                selectedEvent?.stakeholderType === type.name
                  ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                  : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
              }`}
              onClick={() => {
                updateEvent({
                  ...selectedEvent,
                  stakeholderType: type.name,
                  activityCode: type.code, // 対応するコードを設定
                  businessCode: type.code, // businessCodeにも設定
                })
              }}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* 業務分類コード表示 - 購入品タブと同様のデザイン */}
      {selectedEvent?.activityCode && (
        <div className="mb-4 px-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">業務分類コード</label>
          <div className="bg-blue-50 p-2 rounded-md mb-3 flex items-center justify-between">
            <span className="font-mono text-lg font-bold">{selectedEvent.activityCode}</span>
            <span className="text-xs text-gray-500">選択済み</span>
          </div>
        </div>
      )}

      <div className="mb-4 px-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">業務題目</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={selectedEvent?.taskTitle || ""}
          onChange={(e) => {
            updateEvent({ ...selectedEvent, taskTitle: e.target.value })
          }}
        />
      </div>
      <div className="mb-4 px-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">業務内容</label>
        <textarea
          className="w-full p-2 border rounded h-24"
          value={selectedEvent?.taskContent || ""}
          onChange={(e) => {
            updateEvent({ ...selectedEvent, taskContent: e.target.value })
          }}
        ></textarea>
      </div>
    </>
  )
}
