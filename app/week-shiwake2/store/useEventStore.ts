import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Event {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  color?: string;
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setEvents: (events: Event[]) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,
      error: null,

      addEvent: (event) => set((state) => ({
        events: [...state.events, event]
      })),

      updateEvent: (event) => set((state) => ({
        events: state.events.map((e) => e.id === event.id ? event : e)
      })),

      deleteEvent: (eventId) => set((state) => ({
        events: state.events.filter((e) => e.id !== eventId)
      })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setEvents: (events) => set({ events }),
    }),
    {
      name: 'event-storage',
    }
  )
); 