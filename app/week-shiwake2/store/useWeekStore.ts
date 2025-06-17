import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Event } from '../types/event';

interface WeekState {
  currentYear: number;
  currentWeek: number;
  hasChanges: boolean;
  isLoading: boolean;
  error: string | null;
  events: Event[];
  setCurrentYear: (year: number) => void;
  setCurrentWeek: (week: number) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  removeEvent: (eventId: string) => void;
  setEvents: (events: Event[]) => void;
}

export const useWeekStore = create<WeekState>()(
  persist(
    (set, get) => ({
      currentYear: new Date().getFullYear(),
      currentWeek: getCurrentWeek(),
      hasChanges: false,
      isLoading: false,
      error: null,
      events: [],
      setCurrentYear: (year) => set({ currentYear: year }),
      setCurrentWeek: (week) => set({ currentWeek: week }),
      setHasChanges: (hasChanges) => set({ hasChanges }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      addEvent: (event) => set({ events: [...get().events, event] }),
      updateEvent: (event) => set({ events: get().events.map(e => e.id === event.id ? event : e) }),
      removeEvent: (eventId) => set({ events: get().events.filter(e => e.id !== eventId) }),
      setEvents: (events) => set({ events }),
    }),
    {
      name: 'week-storage',
    }
  )
);

// 現在の週番号を取得する関数
function getCurrentWeek() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.ceil(diff / oneWeek);
} 