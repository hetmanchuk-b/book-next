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
import {BrutCalendarSummary} from "@/components/calendar/brut-calendar-summary";

interface BrutCalendarProps {
  slots: TimeSlot[];
  onSaveSchedule: (slots: {startTime: string; endTime: string}[]) => Promise<{ success: boolean; scheduleId: string }[]>;
  onCreateSlot: (slotData: { startTime: string; endTime: string }) => Promise<{ success: boolean; scheduleId: string }>;
  onUpdateSlot: (id: string, slot: {startTime: string; endTime: string, status: ScheduleStatus}) => Promise<{ success: boolean; scheduleId: string }>;
  onDeleteSlot: (id: string) => Promise<{ success: boolean }>;
}

export const BrutCalendar = (
  {
    slots,
    onSaveSchedule,
    onCreateSlot,
    onUpdateSlot,
    onDeleteSlot
  }: BrutCalendarProps,
) => {
  const [selectedInterval, setSelectedInterval] = useState(1);
  const [customDuration, setCustomDuration] = useState<number | ''>('');
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>(slots);
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

  const toggleSlotStatus = async (slotId: string) => {
    const slot = selectedSlots.find((s) => s.id === slotId);
    if (!slot) return;
    const newStatus = slot.status === ScheduleStatus.FREE ? ScheduleStatus.BOOKED : ScheduleStatus.FREE;

    try {
      await onUpdateSlot(slotId, {
        startTime: slot.startDate.toISOString(),
        endTime: slot.endDate.toISOString(),
        status: newStatus
      })
      setSelectedSlots((prev) =>
        prev.map((s) =>
          s.id === slotId
            ? { ...s, status: newStatus}
            : s
        )
      );
      toast.success(`Slot status has been updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update slot status')
    }
  }

  const handleTimeSlotClick = async (dayIndex: number, hour: number) => {
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

    // Check if slot inside selected slots
    const overlappingIndex = selectedSlots.findIndex((slot) => {
      return (startDate.getTime() > slot.startDate.getTime() && startDate.getTime() < slot.endDate.getTime())
        || (endDate.getTime() > slot.startDate.getTime() && endDate.getTime() < slot.endDate.getTime())
        || (slot.startDate.getTime() > startDate.getTime() && slot.endDate.getTime() <= endDate.getTime())
        || (slot.startDate.getTime() === startDate.getTime())
        || (slot.id === slotId)
    });

    if (overlappingIndex >= 0) {
      toast.error('Slots cannot overlap');
      return;
    }

    try {
      await onCreateSlot({
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString()
      });

      const newSlot: TimeSlot = {
        id: slotId,
        startDate,
        endDate,
        status: ScheduleStatus.FREE
      }
      setSelectedSlots([...selectedSlots, newSlot])
      toast.success('Slot added to your schedule successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to create slot');
    }
  }

  const saveSchedule = async () => {
    try {
      const slotsToSave = selectedSlots.map((slot) => ({
        startTime: slot.startDate.toISOString(),
        endTime: slot.endDate.toISOString()
      }));
      const results = await onSaveSchedule(slotsToSave);
      setSelectedSlots((prev) => prev.map((slot, index) => ({
        ...slot,
        id: results[index]?.scheduleId || slot.id
      })));
      toast.success('Schedule saved successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save schedule');
    }
  }

  const onRemoveSlot = async (slotId: string) => {
    try {
      await onDeleteSlot(slotId);
      setSelectedSlots(selectedSlots.filter((slot) => slot.id !== slotId));
      toast.info('Slot has been removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove slot');
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
          selectedSlots={selectedSlots}
          getSlotColor={(day, hour) => getSlotColor(day, hour)}
          isSlotSelected={(day, hour) => isSlotSelected(day, hour)}
          onTimeSlotClick={(dayIndex, hour) => handleTimeSlotClick(dayIndex, hour)}
          weekDates={weekDates}
        />
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      <BrutCalendarSummary
        onSaveSchedule={saveSchedule}
        onRemoveSlot={(slotId) => onRemoveSlot(slotId)}
        setSelectedSlots={(slots) => setSelectedSlots(slots)}
        toggleSlotStatus={(slotId) => toggleSlotStatus(slotId)}
        selectedSlots={selectedSlots}
      />
    </div>
  );
}
