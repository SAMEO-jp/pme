'use client';

import React from 'react';
import { useWeekStore } from '../store/useWeekStore';
import { useEventStore } from '../store/useEventStore';
import { useWorkTimeStore } from '../store/useWorkTimeStore';
import { getWeekDates, getWeekDaysArray, formatDayWithWeekday } from '../utils/dateUtils';
import { GRID_SETTINGS } from '../utils/constants';

// 曜日の日本語表記
const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

export function TimeGrid() {
  const { currentYear, currentWeek } = useWeekStore();
  const { events } = useEventStore();
  const { workTimes, updateWorkTime, fetchWorkTimes, saveWorkTimes } = useWorkTimeStore();

  // 週の日付を取得
  const { startDate, endDate } = getWeekDates(currentYear, currentWeek);
  const weekDays = getWeekDaysArray(startDate, endDate);

  // 時間スロットを生成（0時から23時まで）
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const minuteSlots = [0, 30]; // 30分刻みのスロット

  // 今日の日付を取得
  const today = new Date();
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 勤務時間の変更ハンドラ
  const handleWorkTimeChange = async (date: string, startTime: string, endTime: string) => {
    updateWorkTime(date, startTime, endTime);
    await saveWorkTimes();
  };

  // 時間文字列（HH:MM）を分数に変換する関数
  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // 時間を位置（px）に変換する関数
  const timeToPosition = (timeStr: string): number => {
    const minutes = timeToMinutes(timeStr);
    const hours = minutes / 60;
    return hours * GRID_SETTINGS.hourHeight;
  };

  // 指定日の勤務時間を取得
  const getWorkTimeForDay = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    return workTimes.find(wt => wt.date === dateStr);
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
      {/* 全体を一つのスクロールコンテナにまとめる */}
      <div 
        className="overflow-auto"
        style={{ height: "calc(100vh - 8rem)", scrollPaddingTop: "9rem" }}
      >
        <div className="grid" style={{ gridTemplateColumns: 'auto repeat(7, 1fr)' }}>
          {/* 時間ラベルのヘッダー（左上の空白セル） */}
          <div className="sticky top-0 left-0 z-20 p-1 border-r border-b bg-gray-50 w-10"></div>
          
          {/* 日付ヘッダー - stickyで上部に固定 */}
          {weekDays.map((day, index) => {
            const dayOfWeek = day.getDay();
            const bgColorClass = 
              isToday(day) ? "bg-blue-100" : 
              dayOfWeek === 0 ? "bg-red-100" : 
              dayOfWeek === 6 ? "bg-blue-100" : 
              "bg-gray-50";
              
            return (
              <div
                key={index}
                className={`sticky top-0 z-10 p-1 text-center border-r border-b ${bgColorClass}`}
                style={{ height: "42px" }}
              >
                <div className="font-medium text-xs flex flex-col justify-center">
                  <span className="font-bold">{WEEKDAY_JP[dayOfWeek]}</span>
                  <span>{formatDayWithWeekday(day)}</span>
                </div>
              </div>
            );
          })}

          {/* 出退勤時間表示用の左ラベル - stickyで左側と上部に固定 */}
          <div className="sticky left-0 top-[42px] z-20 h-16 border-b border-r p-1 text-xs bg-gray-50 flex flex-col justify-center w-10">
            <div className="text-center">勤務</div>
            <div className="text-center">時間</div>
          </div>

          {/* 各日の出退勤時間表示エリア */}
          {weekDays.map((day, index) => {
            const workTime = getWorkTimeForDay(day);
            const dayOfWeek = day.getDay();
            const bgColorClass = 
              isToday(day) ? "bg-blue-50" : 
              dayOfWeek === 0 ? "bg-red-50" : 
              dayOfWeek === 6 ? "bg-blue-50" : 
              "bg-white";
              
            return (
              <div
                key={index}
                className={`sticky top-[42px] z-10 h-16 border-r border-b ${bgColorClass}`}
              >
                <div className="h-full flex flex-col justify-center p-1 gap-1">
                  <div className="flex items-center justify-center">
                    <span className="text-xs mr-1 font-semibold">出勤:</span>
                    <input 
                      type="time" 
                      className="text-xs p-0.5 w-16 border bg-white/90 rounded shadow-sm" 
                      value={workTime?.startTime || ""}
                      onChange={(e) => handleWorkTimeChange(day.toISOString().split('T')[0], e.target.value, workTime?.endTime || "")}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-xs mr-1 font-semibold">退勤:</span>
                    <input 
                      type="time" 
                      className="text-xs p-0.5 w-16 border bg-white/90 rounded shadow-sm" 
                      value={workTime?.endTime || ""}
                      onChange={(e) => handleWorkTimeChange(day.toISOString().split('T')[0], workTime?.startTime || "", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* 時間ラベル - stickyで左側に固定 */}
          <div className="col-span-1 sticky left-0 z-10">
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-r p-1 text-xs text-right pr-2 bg-gray-50 flex flex-col justify-center w-10"
              >
                <div>{hour}時</div>
                <div className="relative h-full">
                  {/* 30分の目盛りのみ表示 */}
                  <div className="absolute w-full border-t border-gray-100" style={{ top: `50%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* 各日の時間スロット */}
          {weekDays.map((day, dayIndex) => {
            const workTime = getWorkTimeForDay(day);
            const startTimePosition = workTime?.startTime ? timeToPosition(workTime.startTime) : 0;
            const endTimePosition = workTime?.endTime ? timeToPosition(workTime.endTime) : 0;
            const hasWorkTime = workTime?.startTime && workTime?.endTime;
            
            return (
              <div key={dayIndex} className="col-span-1 relative">
                {/* 出勤時間から退勤時間までの範囲を示す背景 */}
                {hasWorkTime && (
                  <div 
                    className="absolute left-0 right-0 z-0 bg-gray-200/80 border-y border-dashed border-gray-400"
                    style={{ 
                      top: `${startTimePosition}px`, 
                      height: `${endTimePosition - startTimePosition}px` 
                    }}
                  />
                )}

                {timeSlots.map((hour) => (
                  <React.Fragment key={hour}>
                    {/* 30分刻みのスロット */}
                    {minuteSlots.map((minute) => (
                      <div
                        key={`${hour}-${minute}`}
                        className="h-8 border-b border-r hover:bg-gray-50"
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 