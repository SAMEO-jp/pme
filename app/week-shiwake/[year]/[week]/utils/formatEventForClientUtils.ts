import { EventItem } from "../types/event"
import { EVENT_CATEGORY_COLORS } from "../constants"

/**
 * イベントデータをクライアント表示用にフォーマットする
 * @param item イベントアイテム
 * @returns フォーマットされたイベントデータ
 */
export function formatEventForClient(item: EventItem) {
  const startTime = new Date(item.startDateTime)
  const endTime = new Date(item.endDateTime)
  const startHour = startTime.getHours()
  const startMinutes = startTime.getMinutes()
  const endHour = endTime.getHours()
  const endMinutes = endTime.getMinutes()
  const duration = (endHour - startHour) * 60 + (endMinutes - startMinutes)
  const top = startHour * 64 + (startMinutes / 60) * 64
  const height = (duration / 60) * 64

  return {
    id: item.keyID,
    keyID: item.keyID,
    title: item.subject,
    startDateTime: item.startDateTime,
    endDateTime: item.endDateTime,
    description: item.content || "",
    project: item.projectNumber || "",
    category: item.type || "",
    color: item.type ? (EVENT_CATEGORY_COLORS[item.type] || "#3788d8") : "#3788d8",
    employeeNumber: item.employeeNumber,
    position: item.position,
    facility: item.facility,
    status: item.status,
    organizer: item.organizer,
    top,
    height,
    businessCode: item.businessCode || item.classification5 || "",
    departmentCode: item.departmentCode || "",
    weekCode: item.weekCode,
    classification1: item.classification1,
    classification2: item.classification2,
    classification3: item.classification3,
    classification4: item.classification4,
    classification5: item.classification5,
    classification6: item.classification6,
    classification7: item.classification7,
    classification8: item.classification8,
    classification9: item.classification9,
    activityCode: item.businessCode || item.classification5 || "",
    activityRow: item.classification6 || "",
    activityColumn: item.classification7 || "",
    activitySubcode: item.classification8 || "",
    equipmentNumber: item.departmentCode || "",
  }
} 