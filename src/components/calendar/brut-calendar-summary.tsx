import {ComponentPropsWithoutRef} from "react";
import {cn, groupTimeSlotsByDay} from "@/lib/utils";
import {formatDate, formatTime, getDurationHours, TimeSlot} from "@/lib/calendar-utils";
import {ScheduleStatus} from "@prisma/client";
import {Icons} from "@/components/common/icons";
import {Button} from "@/components/ui/button";

interface BrutCalendarSummaryProps extends ComponentPropsWithoutRef<'div'> {
  selectedSlots: TimeSlot[];
  toggleSlotStatus: (slotId: string) => void;
  setSelectedSlots: (slots: TimeSlot[]) => void;
  onRemoveSlot: (slotId: string) => void;
}

export const BrutCalendarSummary = (
  {
    selectedSlots,
    setSelectedSlots,
    toggleSlotStatus,
    onRemoveSlot,
    className,
    ...props
  }: BrutCalendarSummaryProps
) => {
  if (!selectedSlots.length) return null;

  const sortedSlots = groupTimeSlotsByDay(selectedSlots);

  return (
    <div
      className={cn(
        'border-4 bg-neutral-100 p-4',
        className
      )}
      {...props}
    >
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center mb-2">
        <h3 className="text-xl md:text-2xl font-black uppercase">Selected Time Slots</h3>
        {/*<div className="flex gap-2">*/}
        {/*  <Button*/}
        {/*    type='button'*/}
        {/*    variant='destructive'*/}
        {/*    className="font-bold border-0"*/}
        {/*    onClick={() => setSelectedSlots([])}*/}
        {/*    size='sm'*/}
        {/*  >*/}
        {/*    <Icons.remove className="size-5 stroke-3" />*/}
        {/*    Clear all*/}
        {/*  </Button>*/}
      </div>
      <div className="space-y-4">
        {sortedSlots.map((slotLine, index) => (
          <div>
            <p className="text-sm font-bold">{formatDate(slotLine[0].startDate)}</p>
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {slotLine.map((slot) => (
                <BrutCalendarSummaryCard
                  key={slot.id}
                  toggleSlotStatus={toggleSlotStatus}
                  onRemoveSlot={onRemoveSlot}
                  timeSlot={slot}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BrutCalendarSummaryCardProps extends ComponentPropsWithoutRef<'div'> {
  toggleSlotStatus: (slotId: string) => void;
  onRemoveSlot: (slotId: string) => void;
  timeSlot: TimeSlot;
}

export const BrutCalendarSummaryCard = (
  {
    toggleSlotStatus,
    timeSlot,
    onRemoveSlot,
  }: BrutCalendarSummaryCardProps
) => {
  return (
    <div
      key={timeSlot.id}
      className={cn(
        'border-2 p-4 space-y-2',
        timeSlot.status === ScheduleStatus.FREE ? 'bg-green-100' : 'bg-red-100',
      )}
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Icons.calendar className="size-4"/>
            <div className="text-sm font-black">{formatDate(timeSlot.startDate)}</div>
          </div>
          <div className="text-lg font-black">
            {formatTime(timeSlot.startDate)} - {formatTime(timeSlot.endDate)}
          </div>
          <div className="text-xs font-bold text-gray-600">
            Duration: {getDurationHours(timeSlot.startDate, timeSlot.endDate)}h
          </div>
          {timeSlot.endDate.getDate() !== timeSlot.startDate.getDate() && (
            <div className="mt-1 text-xs font-bold text-red-600">SPANS TO: {formatDate(timeSlot.endDate)}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            type="button"
            size='sm'
            className="font-bold border-0 text-sm w-full"
            onClick={(e) => {
              e.preventDefault();
              toggleSlotStatus(timeSlot.id)
            }}
          >
            {timeSlot.status === ScheduleStatus.FREE
              ? <Icons.toggleLeft className="size-5 stroke-3"/>
              : <Icons.toggleRight className="size-5 stroke-3"/>}
            Change Status
          </Button>
          <Button
            type="button"
            size='sm'
            onClick={() => onRemoveSlot(timeSlot.id)}
            className="font-bold border-0 text-sm w-full"
            variant='destructive'
          >
            <Icons.remove className="size-5 stroke-3" />
            Remove Slot
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className={cn(
          'flex items-center gap-2 rounded border-2 border-black px-2 py-1',
          timeSlot.status === ScheduleStatus.FREE ? 'bg-green-200' : 'bg-red-200',
        )}>
          {timeSlot.status === ScheduleStatus.FREE ? (
            <>
              <Icons.check className="size-5"/>
              <span className="text-xs font-black uppercase">Free</span>
            </>
          ) : (
            <>
              <Icons.x className="size-5"/>
              <span className="text-xs font-black uppercase">Booked</span>
            </>
          )}
        </div>
      </div>

    </div>
  )
}