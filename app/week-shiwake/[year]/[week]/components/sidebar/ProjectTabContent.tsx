"use client"
import { PlanningTabContent } from "./PlanningTabContent"
import { DesignTabContent } from "./DesignTabContent"
import { MeetingTabContent } from "./MeetingTabContent"
import { PurchaseTabContent } from "./PurchaseTabContent"
import { OtherTabContent } from "./OtherTabContent"

type ProjectTabContentProps = {
  selectedProjectSubTab: string
  selectedEvent: any
  updateEvent: (updatedEvent: any) => void
  projects: any[]
  selectedProjectCode: string
  setSelectedProjectCode: (code: string) => void
  equipmentNumbers: string[]
  selectedEquipment: string
  setSelectedEquipment: (equipment: string) => void
  isLoadingEquipment: boolean
  purchaseItems: any[]
  isLoadingPurchaseItems: boolean
  selectedOtherSubTab?: string
  setSelectedOtherSubTab?: (subTab: string) => void
}

export const ProjectTabContent = ({
  selectedProjectSubTab,
  selectedEvent,
  updateEvent,
  projects,
  selectedProjectCode,
  setSelectedProjectCode,
  equipmentNumbers,
  selectedEquipment,
  setSelectedEquipment,
  isLoadingEquipment,
  purchaseItems,
  isLoadingPurchaseItems,
  selectedOtherSubTab,
  setSelectedOtherSubTab,
}: ProjectTabContentProps) => {
  // プロジェクト選択時の処理
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectCode = e.target.value
    setSelectedProjectCode(projectCode)

    if (selectedEvent) {
      updateEvent({ ...selectedEvent, project: projectCode })
    }
  }

  // 設備番号選択部分はWeekSidebarに移動したため削除

  return (
    <>
      {/* 設備番号選択部分はWeekSidebarに移動したため削除 */}

      {/* サブタブごとのコンテンツ */}
      {selectedProjectSubTab === "計画" && (
        <PlanningTabContent
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
          selectedEquipment={selectedEquipment}
        />
      )}

      {selectedProjectSubTab === "設計" && (
        <DesignTabContent
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
          selectedEquipment={selectedEquipment}
        />
      )}

      {selectedProjectSubTab === "会議" && (
        <MeetingTabContent selectedEvent={selectedEvent} updateEvent={updateEvent} />
      )}

      {selectedProjectSubTab === "購入品" && (
        <PurchaseTabContent
          selectedEvent={selectedEvent}
          updateEvent={updateEvent}
          selectedProjectCode={selectedProjectCode}
          selectedEquipment={selectedEquipment}
          purchaseItems={purchaseItems}
          isLoadingPurchaseItems={isLoadingPurchaseItems}
        />
      )}

      {selectedProjectSubTab === "その他" && (
        <OtherTabContent 
          selectedEvent={selectedEvent} 
          updateEvent={updateEvent}
          selectedOtherSubTab={selectedOtherSubTab || "〇先対応"}
          setSelectedOtherSubTab={setSelectedOtherSubTab}
        />
      )}
    </>
  )
}
