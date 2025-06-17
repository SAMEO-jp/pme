'use client';

import { useDroppable } from '@dnd-kit/core';

interface TimeSlot {
  time: string;
}

interface DroppableTimeSlotProps {
  timeSlot: string;
}

export function DroppableTimeSlot({ timeSlot }: DroppableTimeSlotProps) {
  const { setNodeRef } = useDroppable({
    id: timeSlot,
  });

  return (
    <div
      ref={setNodeRef}
      className="w-full h-16 border-b border-gray-200"
    />
  );
} 