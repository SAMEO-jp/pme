'use client';

import { Event } from '../store/useEventStore';

interface EventDragOverlayProps {
  event: Event | null;
}

export function EventDragOverlay({ event }: EventDragOverlayProps) {
  if (!event) return null;

  return (
    <div className="fixed pointer-events-none z-50">
      <div className="bg-white border border-gray-200 rounded shadow-lg p-2">
        <div className="text-sm font-medium">{event.title}</div>
        <div className="text-xs text-gray-500">
          {new Date(event.startDateTime).toLocaleTimeString()} - {new Date(event.endDateTime).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
} 