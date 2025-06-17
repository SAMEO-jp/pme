export type TimeSlot = {
  time: string;
};

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  category: string;
}

export interface EventDragData {
  event: Event;
  source: {
    date: string;
    timeSlot: string;
  };
}

export type EventCategory =
  | 'meeting'
  | 'design'
  | 'planning'
  | 'indirect'
  | 'other'
  | 'purchase'
  | 'project'
  | 'stakeholder'; 