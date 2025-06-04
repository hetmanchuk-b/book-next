"use client";

import {toast} from "sonner";
import {ScheduleStatus} from "@prisma/client";
import {useState} from "react";
import {TimeSlot} from "@/lib/calendar-utils";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {BrutCalendarHeader} from "@/components/calendar/brut-calendar-header";
import {BrutCalendarDurationsControls} from "@/components/calendar/brut-calendar-durations-controls";
import {BrutCalendarWeekNav} from "@/components/calendar/brut-calendar-week-nav";
import {BrutCalendarGrid} from "@/components/calendar/brut-calendar-grid";
import {BrunCalendarSummary} from "@/components/calendar/brun-calendar-summary";

export const BrutCalendar = () => {
  const [selectedInterval, setSelectedInterval] = useState(1);
  const [customDuration, setCustomDuration] = useState<number | ''>('');
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [isAbleToShowPrevWeek, setIsAbleToShowPrevWeek] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const getPrevWeekStart = () => {
    const prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    prevMonday.setHours(0, 0, 0, 0);
    return prevMonday;
  }

  const getWeekDates = () => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(currentWeekStart.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates();

  const navigateWeek = (direction: number) => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(currentWeekStart.getDate() + direction * 7)

    if (getPrevWeekStart().getTime() >= newWeekStart.getTime()) {
      setIsAbleToShowPrevWeek(false);
    } else {
      setIsAbleToShowPrevWeek(true);
    }

    setCurrentWeekStart(newWeekStart);
  }

  const getCurrentDuration = () => {
    if (customDuration) {
      const parsed = Number(customDuration)
      return isNaN(parsed) ? selectedInterval : parsed
    }
    return selectedInterval
  }

  const isSlotSelected = (dayIndex: number, hour: number) => {
    const checkDate = new Date(weekDates[dayIndex])
    checkDate.setHours(hour, 0, 0, 0)

    return selectedSlots.some((slot) => {
      const slotStart = new Date(slot.startDate)
      const slotEnd = new Date(slot.endDate)
      return checkDate >= slotStart && checkDate < slotEnd
    })
  }

  const toggleSlotStatus = (slotId: string) => {
    setSelectedSlots((prev) => prev.map((slot) => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: slot.status === ScheduleStatus.FREE ? ScheduleStatus.BOOKED : ScheduleStatus.FREE,
        }
      }
      return slot
    }));
  }

  const handleTimeSlotClick = (dayIndex: number, hour: number) => {
    const startDate = new Date(weekDates[dayIndex])
    startDate.setHours(hour, 0, 0, 0)

    if (startDate.getTime() < Date.now()) {
      toast.error('Date cannot be in the past');
      return
    }

    const duration = getCurrentDuration()
    const endDate = new Date(startDate)
    endDate.setTime(startDate.getTime() + duration * 60 * 60 * 1000)

    const slotId = `${startDate.toISOString()}-${endDate.toISOString()}`

    // Check if slot already exists
    const existingSlotIndex = selectedSlots.findIndex((slot) => slot.id === slotId)

    if (existingSlotIndex >= 0) {
      // Remove existing slot
      setSelectedSlots(selectedSlots.filter((_, index) => index !== existingSlotIndex))
    } else {
      // Add new slot
      const newSlot: TimeSlot = {
        id: slotId,
        startDate,
        endDate,
        status: ScheduleStatus.FREE
      }
      setSelectedSlots([...selectedSlots, newSlot])
    }
  }

  const getSlotColor = (dayIndex: number, hour: number) => {
    const checkDate = new Date(weekDates[dayIndex])
    checkDate.setHours(hour, 0, 0, 0);

    const slot = selectedSlots.find((s) => {
      const slotStart = new Date(s.startDate)
      const slotEnd = new Date(s.endDate)
      return checkDate >= slotStart && checkDate < slotEnd
    })

    if (!slot) return ""

    return slot.status === ScheduleStatus.FREE ? 'bg-green-500 hover:bg-green-600' : 'bg-rose-500 hover:bg-rose-600'
  }

  return (
    <div className="bg-neutral-600 lg:p-4 space-y-4">
      <BrutCalendarHeader />
      <BrutCalendarDurationsControls
        setCustomDuration={(val) => setCustomDuration(val)}
        customDuration={customDuration}
        selectedInterval={selectedInterval}
        onSetSelectedInterval={(value) => {
          setSelectedInterval(value);
          setCustomDuration('');
        }}
      />
      <BrutCalendarWeekNav
        isPrevDisabled={!isAbleToShowPrevWeek}
        onNavigateWeek={(val) => navigateWeek(val)}
        weekDates={weekDates}
      />

      <ScrollArea className="w-full border-4 bg-neutral-100">
        <BrutCalendarGrid
          getSlotColor={(day, hour) => getSlotColor(day, hour)}
          isSlotSelected={(day, hour) => isSlotSelected(day, hour)}
          onTimeSlotClick={(dayIndex, hour) => handleTimeSlotClick(dayIndex, hour)}
          weekDates={weekDates}
        />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      <BrunCalendarSummary
        setSelectedSlots={(slots) => setSelectedSlots(slots)}
        toggleSlotStatus={(slotId) => toggleSlotStatus(slotId)}
        selectedSlots={selectedSlots}
      />
    </div>
  );
}


