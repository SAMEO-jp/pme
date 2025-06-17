"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { formatDateTimeForStorage, parseDateTime, TIME_SLOT_HEIGHT } from "../utils/dateUtils"
import { setWeekDataChanged, saveWeekDataToStorage } from "@/lib/client-storage"

export function useResizeEvent(
  events: any[],
  setEvents: React.Dispatch<React.SetStateAction<any[]>>,
  selectedEvent: any,
  setSelectedEvent: React.Dispatch<React.SetStateAction<any>>,
  year: number,
  week: number,
) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeData, setResizeData] = useState<{ 
    event: any; 
    position: string;
    initialY: number;
    initialEvent: any;
  } | null>(null)

  // リサイズ処理
  useEffect(() => {
    if (!isResizing || !resizeData) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation() // イベント伝播を停止

      const { event, position, initialY, initialEvent } = resizeData
      
      // マウスの移動量を計算（ピクセル単位）
      const deltaY = e.clientY - initialY
      
      // 10分単位に変換（1時間 = 64px）
      const minuteHeight = TIME_SLOT_HEIGHT / 60 // 1分あたりの高さ
      const deltaMinutes = Math.round(deltaY / minuteHeight / 10) * 10 // 10分単位でスナップ
      
      // 上端または下端のリサイズに対応
      if (position === "bottom") {
        // 下端のリサイズ
        const startTime = parseDateTime(initialEvent.startDateTime)
        const originalEndTime = parseDateTime(initialEvent.endDateTime)
        
        // 元の終了時間に移動量を加算
        const newEndTime = new Date(originalEndTime)
        newEndTime.setMinutes(originalEndTime.getMinutes() + deltaMinutes)
        
        // 開始時間より前にならないようにチェック（最小30分）
        const minEndTime = new Date(startTime)
        minEndTime.setMinutes(minEndTime.getMinutes() + 30)
        
        if (newEndTime <= minEndTime) {
          newEndTime.setTime(minEndTime.getTime())
        }
        
        // 24時間を超えないようにチェック
        const maxTime = new Date(startTime)
        maxTime.setHours(23)
        maxTime.setMinutes(59)
        
        if (newEndTime > maxTime) {
          newEndTime.setTime(maxTime.getTime())
        }
        
        // 日時を正しくフォーマット
        const newEndTimeStr = formatDateTimeForStorage(newEndTime)
        
        // 期間を計算して高さを更新
        const duration = (newEndTime.getTime() - startTime.getTime()) / 60000 // 分単位
        const height = (duration / 60) * TIME_SLOT_HEIGHT
        
        // イベントの更新
        const updatedEvents = events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              endDateTime: newEndTimeStr,
              height,
              unsaved: true,
            }
          }
          return e
        })
        
        setEvents(updatedEvents)
        
        // 選択中のイベントも更新
        if (selectedEvent && selectedEvent.id === event.id) {
          const updatedEvent = updatedEvents.find((e) => e.id === event.id)
          if (updatedEvent) {
            setSelectedEvent(updatedEvent)
          }
        }
      } else if (position === "top") {
        // 上端のリサイズ
        const originalStartTime = parseDateTime(initialEvent.startDateTime)
        const endTime = parseDateTime(initialEvent.endDateTime)
        
        // 元の開始時間に移動量を加算
        const newStartTime = new Date(originalStartTime)
        newStartTime.setMinutes(originalStartTime.getMinutes() + deltaMinutes)
        
        // 終了時間より後にならないようにチェック（最小30分）
        const maxStartTime = new Date(endTime)
        maxStartTime.setMinutes(maxStartTime.getMinutes() - 30)
        
        if (newStartTime >= maxStartTime) {
          newStartTime.setTime(maxStartTime.getTime())
        }
        
        // 0時より前にならないようにチェック
        const minTime = new Date(endTime)
        minTime.setHours(0)
        minTime.setMinutes(0)
        
        if (newStartTime < minTime) {
          newStartTime.setTime(minTime.getTime())
        }
        
        // 日時を正しくフォーマット
        const newStartTimeStr = formatDateTimeForStorage(newStartTime)
        
        // 期間を計算して高さを更新
        const duration = (endTime.getTime() - newStartTime.getTime()) / 60000 // 分単位
        const height = (duration / 60) * TIME_SLOT_HEIGHT
        
        // 新しい上端位置を計算
        const top = newStartTime.getHours() * TIME_SLOT_HEIGHT + (newStartTime.getMinutes() / 60) * TIME_SLOT_HEIGHT
        
        // イベントの更新
        const updatedEvents = events.map((e) => {
          if (e.id === event.id) {
            return {
              ...e,
              startDateTime: newStartTimeStr,
              height,
              top,
              unsaved: true,
            }
          }
          return e
        })
        
        setEvents(updatedEvents)
        
        // 選択中のイベントも更新
        if (selectedEvent && selectedEvent.id === event.id) {
          const updatedEvent = updatedEvents.find((e) => e.id === event.id)
          if (updatedEvent) {
            setSelectedEvent(updatedEvent)
          }
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeData(null)

      // 変更をローカルストレージに保存
      saveWeekDataToStorage(year, week, events)
      setWeekDataChanged(year, week, true)
      
      // マウスカーソルを元に戻す
      document.body.style.cursor = 'default'
    }

    // グローバルにイベントリスナーを追加
    document.addEventListener("mousemove", handleMouseMove, { capture: true })
    document.addEventListener("mouseup", handleMouseUp, { capture: true })
    
    // リサイズ中はマウスカーソルを変更
    document.body.style.cursor = 'ns-resize'

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, { capture: true })
      document.removeEventListener("mouseup", handleMouseUp, { capture: true })
      document.body.style.cursor = 'default'
    }
  }, [isResizing, resizeData, events, year, week, selectedEvent, setEvents, setSelectedEvent])

  // リサイズ開始ハンドラ
  const handleResizeStart = (event: any, position: string) => {
    // マウスイベントをキャプチャするためdnd-kitのドラッグを一時的に無効化
    setIsResizing(true)
    
    // 初期状態を記録
    setResizeData({ 
      event, 
      position,
      initialY: (window.event as MouseEvent)?.clientY || 0,
      initialEvent: { ...event }
    })
  }

  return { handleResizeStart }
}
