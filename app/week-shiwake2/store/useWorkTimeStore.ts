import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useWeekStore } from './useWeekStore';

export interface WorkTime {
  date: string;
  startTime?: string;
  endTime?: string;
}

interface WorkTimeState {
  workTimes: WorkTime[];
  isLoading: boolean;
  error: string | null;
  setWorkTimes: (workTimes: WorkTime[]) => void;
  updateWorkTime: (date: string, startTime: string, endTime: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchWorkTimes: () => Promise<void>;
  saveWorkTimes: () => Promise<void>;
}

export const useWorkTimeStore = create<WorkTimeState>()(
  persist(
    (set, get) => ({
      workTimes: [],
      isLoading: false,
      error: null,
      setWorkTimes: (workTimes) => set({ workTimes }),
      updateWorkTime: (date, startTime, endTime) => {
        const { workTimes } = get();
        const existingIndex = workTimes.findIndex(wt => wt.date === date);

        if (existingIndex >= 0) {
          // 既存のデータを更新
          const updatedWorkTimes = [...workTimes];
          updatedWorkTimes[existingIndex] = {
            ...updatedWorkTimes[existingIndex],
            startTime,
            endTime
          };
          set({ workTimes: updatedWorkTimes });
        } else {
          // 新しいデータを追加
          set({ workTimes: [...workTimes, { date, startTime, endTime }] });
        }
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      fetchWorkTimes: async () => {
        const { currentYear, currentWeek } = useWeekStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/week-shiwake2?year=${currentYear}&week=${currentWeek}`);
          const data = await response.json();

          if (data.success) {
            set({ workTimes: data.data });
          } else {
            set({ error: data.message || '勤務時間データの取得に失敗しました' });
          }
        } catch (error) {
          set({ error: '勤務時間データの取得中にエラーが発生しました' });
        } finally {
          set({ isLoading: false });
        }
      },
      saveWorkTimes: async () => {
        const { workTimes } = get();
        const { currentYear, currentWeek } = useWeekStore.getState();
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(`/api/week-shiwake2?year=${currentYear}&week=${currentWeek}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ workTimes }),
          });

          const data = await response.json();

          if (!data.success) {
            set({ error: data.message || '勤務時間データの保存に失敗しました' });
          }
        } catch (error) {
          set({ error: '勤務時間データの保存中にエラーが発生しました' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'worktime-storage',
    }
  )
); 