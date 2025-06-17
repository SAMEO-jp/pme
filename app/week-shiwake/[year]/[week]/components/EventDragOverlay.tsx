import { parseDateTime, FIFTEEN_MIN_HEIGHT } from "../imports"

type EventDragOverlayProps = {
  event: any
}

export const EventDragOverlay = ({ event }: EventDragOverlayProps) => {
  if (!event) return null

  const startTime = parseDateTime(event.startDateTime)
  const endTime = parseDateTime(event.endDateTime)

  // ドラッグオフセットを取得（デフォルトは15分の高さ）
  const dragOffset = event.dragHandleOffset || FIFTEEN_MIN_HEIGHT

  return (
    <div
      className="rounded-md px-2 py-1 overflow-hidden text-white text-xs pointer-events-none relative shadow-lg"
      style={{
        height: `${event.height}px`,
        width: "200px",
        backgroundColor: event.color,
        opacity: 0.9,
        // ドラッグオーバーレイは dnd-kit の既定の挙動で中央寄せされるので、
        // これを上端合わせにするため、アイテムの高さの半分だけ上にずらす
        transform: `translate(-30%, -${event.height / 2}px)`,
      }}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div>
        {startTime.getHours().toString().padStart(2, "0")}:{startTime.getMinutes().toString().padStart(2, "0")} -{" "}
        {endTime.getHours().toString().padStart(2, "0")}:{endTime.getMinutes().toString().padStart(2, "0")}
      </div>

      {/* 視覚的フィードバックの追加 - ドラッグポイントを示す白い点 */}
      <div
        className="absolute left-0 w-2 h-2 bg-white rounded-full"
        style={{ top: dragOffset, transform: "translateX(-50%)" }}
      />
    </div>
  )
}
