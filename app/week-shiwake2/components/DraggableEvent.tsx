'use client';

import { useDraggable } from '@dnd-kit/core';
import { Event } from '../store/useEventStore';
import { EVENT_CATEGORIES } from '../utils/constants';

interface DraggableEventProps {
  event: Event;
}

export function DraggableEvent({ event }: DraggableEventProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: {
      event,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // 分単位
  const top = startTime.getHours() * 64 + (startTime.getMinutes() / 60) * 64;
  const height = (duration / 60) * 64;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
        top,
        height,
        width: '100px',
        backgroundColor: EVENT_CATEGORIES[event.category as keyof typeof EVENT_CATEGORIES]?.color || '#ccc',
      }}
      className="p-2 text-white text-sm rounded cursor-move"
      {...listeners}
      {...attributes}
    >
      <div className="font-bold">{event.title}</div>
      <div className="text-xs">
        {startTime.getHours().toString().padStart(2, '0')}:
        {startTime.getMinutes().toString().padStart(2, '0')} - 
        {endTime.getHours().toString().padStart(2, '0')}:
        {endTime.getMinutes().toString().padStart(2, '0')}
      </div>
    </div>
  );
} 