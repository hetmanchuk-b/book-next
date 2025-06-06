import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Schedule} from "@prisma/client";
import {TimeSlot} from "@/lib/calendar-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function groupSchedulesByDay(schedules: Schedule[]): Schedule[][] {
  const sorted = [...schedules].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const groups: Record<string, Schedule[]> = {};

  for (const slot of sorted) {
    const dateKey = slot.startTime.toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(slot);
  }

  return Object.keys(groups).sort().map((key) => groups[key]);
}

export function groupTimeSlotsByDay(schedules: TimeSlot[]): TimeSlot[][] {
  const sorted = [...schedules].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const groups: Record<string, TimeSlot[]> = {};

  for (const slot of sorted) {
    const dateKey = slot.startDate.toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(slot);
  }

  return Object.keys(groups).sort().map((key) => groups[key]);
}