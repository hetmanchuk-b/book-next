import {ScheduleStatus} from "@prisma/client";

export const PRESET_INTERVALS = [
  { label: "30 min", value: 0.5 },
  { label: "45 min", value: 0.75 },
  { label: "1 hour", value: 1 },
  { label: "1:30 hours", value: 1.5 },
  { label: "2 hours", value: 2 },
  { label: "2:30 hours", value: 2.5 },
  { label: "3 hours", value: 3 },
  { label: "4 hours", value: 4 },
];

export const HOURS = Array.from({length: 24}).map((_, i) => i);
export const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export interface TimeSlot {
  id: string;
  startDate: Date;
  endDate: Date;
  status: ScheduleStatus;
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const getDurationHours = (start: Date, end: Date) => {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

