"use client"

type PurchaseTabContentProps = {
  selectedEvent: any
  updateEvent: (updatedEvent: any) => void
  selectedProjectCode: string
  selectedEquipment: string
  purchaseItems: any[]
  isLoadingPurchaseItems: boolean
}

export const PurchaseTabContent = ({
  selectedEvent,
  updateEvent,
  selectedProjectCode,
  selectedEquipment,
  purchaseItems,
  isLoadingPurchaseItems,
}: PurchaseTabContentProps) => {
  return (
    <>
      {/* 購入品選択部分は削除 */}

      {/* 業務分類コード選択UI - WeekSidebarに移動済み */}
      {/* 横列選択（中分類）はサブタブに移動済み */}
    </>
  )
}
