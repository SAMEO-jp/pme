"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { calculateEventHeight, calculateEventTop } from "../utils/eventUtils";

export function useResizeEvent(
  events: any[],
  setEvents: React.Dispatch<React.SetStateAction<any[]>>,
  selectedEvent: any,
  setSelectedEvent: React.Dispatch<React.SetStateAction<any>>,
) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{
    event: any;
    position: string;
    initialY: number;
    initialEvent: any;
  } | null>(null);

  useEffect(() => {
    if (!isResizing || !resizeData) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const { event, position, initialY, initialEvent } = resizeData;
      const deltaY = e.clientY - initialY;
      const minuteHeight = 60 / 60; // 1分あたりの高さ（60px/1h）
      const deltaMinutes = Math.round(deltaY / minuteHeight / 10) * 10;

      if (position === "bottom") {
        // 下端リサイズ
        const [startHour, startMinute] = initialEvent.startTime.split(":").map(Number);
        const [endHour, endMinute] = initialEvent.endTime.split(":").map(Number);
        const start = new Date(0, 0, 0, startHour, startMinute);
        const end = new Date(0, 0, 0, endHour, endMinute);
        const newEnd = new Date(end);
        newEnd.setMinutes(end.getMinutes() + deltaMinutes);
        // 最小30分
        const minEnd = new Date(start);
        minEnd.setMinutes(minEnd.getMinutes() + 30);
        if (newEnd <= minEnd) newEnd.setTime(minEnd.getTime());
        // 24:00超え防止
        if (newEnd.getHours() > 23 || (newEnd.getHours() === 23 && newEnd.getMinutes() > 59)) {
          newEnd.setHours(23, 59);
        }
        const newEndTime = `${newEnd.getHours().toString().padStart(2, "0")}:${newEnd.getMinutes().toString().padStart(2, "0")}`;
        const updatedEvents = events.map((e) =>
          e.id === event.id
            ? {
                ...e,
                endTime: newEndTime,
                height: calculateEventHeight(e.startTime, newEndTime),
              }
            : e
        );
        setEvents(updatedEvents);
        if (selectedEvent && selectedEvent.id === event.id) {
          const updatedEvent = updatedEvents.find((e) => e.id === event.id);
          if (updatedEvent) setSelectedEvent(updatedEvent);
        }
      } else if (position === "top") {
        // 上端リサイズ
        const [startHour, startMinute] = initialEvent.startTime.split(":").map(Number);
        const [endHour, endMinute] = initialEvent.endTime.split(":").map(Number);
        const start = new Date(0, 0, 0, startHour, startMinute);
        const end = new Date(0, 0, 0, endHour, endMinute);
        const newStart = new Date(start);
        newStart.setMinutes(start.getMinutes() + deltaMinutes);
        // 最小30分
        const maxStart = new Date(end);
        maxStart.setMinutes(maxStart.getMinutes() - 30);
        if (newStart >= maxStart) newStart.setTime(maxStart.getTime());
        // 0:00未満防止
        if (newStart.getHours() < 0) newStart.setHours(0, 0);
        const newStartTime = `${newStart.getHours().toString().padStart(2, "0")}:${newStart.getMinutes().toString().padStart(2, "0")}`;
        const updatedEvents = events.map((e) =>
          e.id === event.id
            ? {
                ...e,
                startTime: newStartTime,
                height: calculateEventHeight(newStartTime, e.endTime),
                top: calculateEventTop(newStartTime),
              }
            : e
        );
        setEvents(updatedEvents);
        if (selectedEvent && selectedEvent.id === event.id) {
          const updatedEvent = updatedEvents.find((e) => e.id === event.id);
          if (updatedEvent) setSelectedEvent(updatedEvent);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeData(null);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove, { capture: true });
    document.addEventListener("mouseup", handleMouseUp, { capture: true });
    document.body.style.cursor = "ns-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove, { capture: true });
      document.removeEventListener("mouseup", handleMouseUp, { capture: true });
      document.body.style.cursor = "default";
    };
  }, [isResizing, resizeData, events, selectedEvent, setEvents, setSelectedEvent]);

  const handleResizeStart = (event: any, position: string) => {
    setIsResizing(true);
    setResizeData({
      event,
      position,
      initialY: (window.event as MouseEvent)?.clientY || 0,
      initialEvent: { ...event },
    });
  };

  return { handleResizeStart };
} 