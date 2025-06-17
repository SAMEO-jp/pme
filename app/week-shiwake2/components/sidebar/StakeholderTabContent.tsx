'use client';

import { useState } from 'react';
import { Event } from '../../types/event';
import { createEvent } from '../../utils/eventUtils';
import { useWeekStore } from '../../store/useWeekStore';

export function StakeholderTabContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const { currentYear, currentWeek } = useWeekStore();

  const handleAddEvent = (title: string, startTime: string, endTime: string) => {
    const newEvent = createEvent(
      title,
      new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      'stakeholder'
    );
    setEvents([...events, newEvent]);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">ステークホルダー</h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-2 bg-brown-100 rounded"
          >
            <div className="font-bold">{event.title}</div>
            <div className="text-sm">
              {event.startTime} - {event.endTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 