import { Event, TimeSlot } from '../types/event';
import { getTimeString } from './dateUtils';

export function createEvent(
  title: string,
  date: string,
  startTime: string,
  endTime: string,
  category: string
): Event {
  return {
    id: crypto.randomUUID(),
    title,
    date,
    startTime,
    endTime,
    category,
  };
}

export function calculateEventHeight(startTime: string, endTime: string): number {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  return ((endMinutes - startMinutes) / 60) * 60; // 60px per hour
}

export function calculateEventTop(startTime: string): number {
  const [hour, minute] = startTime.split(':').map(Number);
  return (hour + minute / 60) * 60; // 60px per hour
}

export function getTimeSlotFromPosition(
  top: number,
  left: number,
  dates: string[]
): TimeSlot {
  const hour = Math.floor(top / 60);
  const dateIndex = Math.floor(left / 100);
  return {
    date: dates[dateIndex],
    time: getTimeString(hour, 0),
  };
}

export function formatEventTime(time: string): string {
  return time.padStart(5, '0');
} 