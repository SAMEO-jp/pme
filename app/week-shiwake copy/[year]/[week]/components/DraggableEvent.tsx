"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useDraggable } from "@dnd-kit/core"
import { parseDateTime, FIFTEEN_MIN_HEIGHT } from "../utils/dateUtils"

type DraggableEventProps = {
  event: any
  onClick: (event: any) => void
  onResizeStart: (event: any, position: string) => void
  onCopy?: (event: any) => void
  onDelete?: (event: any) => void
}

// 色の定義を変更し、より濃い色を使用
const colors = {
  会議: "#2563eb", // より濃い青
  営業: "#dc2626", // より濃い赤
  研修: "#7e22ce", // より濃い紫
  開発: "#16a34a", // より濃い緑
  報告: "#ca8a04", // より濃い黄
}

export const DraggableEvent = ({ 
  event, 
  onClick, 
  onResizeStart,
  onCopy = () => {},
  onDelete = () => {}
}: DraggableEventProps) => {
  // 右クリックメニュー用の状態
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // ドラッグハンドルの高さを計算
  const durationMinutes =
    (parseDateTime(event.endDateTime).getTime() - parseDateTime(event.startDateTime).getTime()) / (1000 * 60)
  const handleHeight = Math.max(FIFTEEN_MIN_HEIGHT, Math.min(32, event.height / 3)) // 最小15分、最大30分または1/3の高さ

  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: event.id,
    data: {
      event,
      type: "move",
      handleHeight,
      dragHandleOffset: 0,
    },
  })

  const startTime = parseDateTime(event.startDateTime)
  const endTime = parseDateTime(event.endDateTime)

  // リサイズハンドラーのドラッグ開始処理
  const handleResizeStart = (e: React.MouseEvent, position: string) => {
    e.stopPropagation()
    e.preventDefault() // デフォルトの動作を防止
    onResizeStart(event, position)
  }

  // 右クリックメニューを表示
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // コンテキストメニュー以外をクリックしたら閉じる
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showContextMenu]);

  // コピー機能
  const handleCopy = () => {
    onCopy(event);
    setShowContextMenu(false);
  };

  // 削除機能
  const handleDelete = () => {
    onDelete(event);
    setShowContextMenu(false);
  };

  // returnステートメント内のdiv要素を変更
  return (
    <>
      <div
        ref={setNodeRef}
        className={`absolute overflow-hidden text-xs border border-gray-300 ${
          isDragging ? "opacity-50" : "opacity-100"
        } ${event.unsaved ? "border-yellow-400" : "border-gray-300"} shadow-md rounded-md`}
        style={{
          top: `${event.top}px`,
          height: `${event.height}px`,
          left: "4px",
          right: "4px",
          touchAction: "none",
          cursor: "default",
          backgroundColor: event.color, // 背景色をイベント全体に適用
        }}
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation()
            onClick(event)
          }
        }}
        onContextMenu={handleContextMenu}
      >
        {/* ドラッグハンドル - 上端から配置 */}
        <div
          {...listeners}
          {...attributes}
          className="cursor-move px-2 py-1 text-white font-medium border-b border-white/20"
          style={{
            height: `${handleHeight}px`,
          }}
          data-drag-handle="true"
        >
          <div className="font-bold truncate">{event.title}</div>
        </div>

        {/* イベント本文 - クリック可能だがドラッグ不可 */}
        <div className="py-1 px-2 overflow-hidden text-white">
          <div className="text-xs font-medium">
            {startTime.getHours().toString().padStart(2, "0")}:{startTime.getMinutes().toString().padStart(2, "0")} -{" "}
            {endTime.getHours().toString().padStart(2, "0")}:{endTime.getMinutes().toString().padStart(2, "0")}
          </div>
          {event.description && <div className="text-xs text-white/80 truncate">{event.description}</div>}
        </div>

        {/* 業務コードを右下に表示 - 両方の値を確認 */}
        {(event.activityCode || event.classification5) && (
          <div className="absolute bottom-1 right-1 text-xs font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">
            {event.activityCode || event.classification5}
          </div>
        )}

        {/* 下部リサイズハンドル - より大きく、目立つように */}
        <div
          className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-transparent hover:bg-white hover:bg-opacity-30 z-10"
          onMouseDown={(e) => {
            e.stopPropagation()
            handleResizeStart(e, "bottom")
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* 上部リサイズハンドルを追加 */}
        <div
          className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize bg-transparent hover:bg-white hover:bg-opacity-30 z-10"
          onMouseDown={(e) => {
            e.stopPropagation()
            handleResizeStart(e, "top")
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* 右クリックメニュー */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white shadow-lg rounded-md border border-gray-200 z-50 py-1"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
          }}
        >
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={handleCopy}
          >
            コピー
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
            onClick={handleDelete}
          >
            削除
          </button>
        </div>
      )}
    </>
  )
}
