'use client';

import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useWeekStore } from './store/useWeekStore';
import { useEventStore } from './store/useEventStore';
import { useWorkTimeStore } from './store/useWorkTimeStore';
import { TimeGrid } from './components/TimeGrid';
import { WeekSidebar } from './components/sidebar/WeekSidebar';
import { EventDragOverlay } from './components/EventDragOverlay';
import { useEffect } from 'react';
import { getWeekDates } from './utils/dateUtils';

export default function WeekShiwake2Page() {
  const { 
    currentYear, 
    currentWeek, 
    hasChanges, 
    isLoading, 
    error,
    setHasChanges,
    setLoading,
    setError,
    setCurrentYear,
    setCurrentWeek
  } = useWeekStore();

  const { 
    events, 
    isLoading: eventLoading,
    error: eventError,
    addEvent,
    updateEvent,
    deleteEvent,
    setLoading: setEventLoading,
    setError: setEventError,
    setEvents
  } = useEventStore();

  const {
    workTimes,
    setWorkTimes,
    setLoading: setWorkTimeLoading,
    setError: setWorkTimeError
  } = useWorkTimeStore();

  // 週データの読み込み
  useEffect(() => {
    const loadWeekData = async () => {
      try {
        setLoading(true);
        setEventLoading(true);
        setWorkTimeLoading(true);

        // 週の日付を取得
        const { startDate, endDate } = getWeekDates(currentYear, currentWeek);

        // イベントデータの読み込み
        const response = await fetch(`/api/week-shiwake2/events?year=${currentYear}&week=${currentWeek}`);
        if (!response.ok) {
          throw new Error('イベントデータの取得に失敗しました');
        }
        const data = await response.json();
        if (data.success) {
          setEvents(data.events || []);
        } else {
          throw new Error(data.message || 'イベントデータの取得に失敗しました');
        }

        // 勤務時間データの読み込み
        const workTimeResponse = await fetch(`/api/week-shiwake2?year=${currentYear}&week=${currentWeek}`);
        if (!workTimeResponse.ok) {
          throw new Error('勤務時間データの取得に失敗しました');
        }
        const workTimeData = await workTimeResponse.json();
        if (workTimeData.success) {
          setWorkTimes(workTimeData.data || []);
        } else {
          throw new Error(workTimeData.message || '勤務時間データの取得に失敗しました');
        }

        setHasChanges(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'データの読み込みに失敗しました';
        setError(errorMessage);
        setEventError(errorMessage);
        setWorkTimeError(errorMessage);
      } finally {
        setLoading(false);
        setEventLoading(false);
        setWorkTimeLoading(false);
      }
    };

    loadWeekData();
  }, [currentYear, currentWeek]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedEvent = events.find(e => e.id === active.id);
    if (draggedEvent) {
      // ドラッグ中のイベントの状態管理を修正
      // 必要に応じて実装
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const eventId = active.id as string;
      const newTimeSlot = over.id as string;
      const event = events.find(e => e.id === eventId);
      if (event) {
        updateEvent({
          ...event,
          startDateTime: newTimeSlot,
        });
        setHasChanges(true);
      }
    }
  };

  if (isLoading || eventLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || eventError) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">エラーが発生しました</p>
          <p className="text-sm">{error || eventError}</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        <WeekSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                {currentYear}年 第{currentWeek}週
              </h1>
              {hasChanges && (
                <div className="text-yellow-600">
                  未保存の変更があります
                </div>
              )}
            </div>
            <div className="relative">
              <TimeGrid />
              <EventDragOverlay event={null} />
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
} 