import {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";
import {formatDate, formatTime, getDurationHours, TimeSlot} from "@/lib/calendar-utils";
import {ScheduleStatus} from "@prisma/client";
import {Icons} from "@/components/common/icons";
import {Button} from "@/components/ui/button";

interface BrunCalendarSummaryProps extends ComponentPropsWithoutRef<'div'> {
  selectedSlots: TimeSlot[];
  toggleSlotStatus: (slotId: string) => void;
  setSelectedSlots: (slots: TimeSlot[]) => void;
}

export const BrunCalendarSummary = (
  {
    selectedSlots,
    setSelectedSlots,
    toggleSlotStatus,
    className,
    ...props
  }: BrunCalendarSummaryProps
) => {
  if (!selectedSlots.length) return null;
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
        <div className="flex gap-2">
          <Button
            type='button'
            variant='destructive'
            className="font-bold border-0"
            onClick={() => setSelectedSlots([])}
            size='sm'
          >
            <Icons.remove className="size-5 stroke-3" />
            Clear all
          </Button>
          <Button
            type='button'
            variant='outline'
            className="font-bold border-3"
            onClick={() => setSelectedSlots([])}
            size='sm'
          >
            <Icons.schedule className="size-5 stroke-3" />
            Save Schedule
          </Button>
        </div>
      </div>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {selectedSlots.map((slot) => (
          <div
            key={slot.id}
            className={cn(
              'border-2 p-4 space-y-2',
              slot.status === ScheduleStatus.FREE ? 'bg-green-100' : 'bg-red-100',
            )}
          >
            <div className="flex items-center gap-2">
              <Icons.calendar className="size-4" />
              <div className="text-sm font-black">{formatDate(slot.startDate)}</div>
            </div>
            <div className="text-lg font-black">
              {formatTime(slot.startDate)} - {formatTime(slot.endDate)}
            </div>
            <div className="text-xs font-bold text-gray-600">
              Duration: {getDurationHours(slot.startDate, slot.endDate)}h
            </div>
            {slot.endDate.getDate() !== slot.startDate.getDate() && (
              <div className="mt-1 text-xs font-bold text-red-600">SPANS TO: {formatDate(slot.endDate)}</div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className={cn(
                'flex items-center gap-2 rounded border-2 border-black px-2 py-1',
                slot.status === ScheduleStatus.FREE ? 'bg-green-200' : 'bg-red-200',
              )}>
                {slot.status === ScheduleStatus.FREE ? (
                  <>
                    <Icons.check className="size-5" />
                    <span className="text-xs font-black uppercase">Free</span>
                  </>
                ) : (
                  <>
                    <Icons.x className="size-5"/>
                    <span className="text-xs font-black uppercase">Booked</span>
                  </>
                )}
              </div>
              <Button
                type="button"
                size='sm'
                onClick={(e) => {
                  e.preventDefault();
                  toggleSlotStatus(slot.id)
                }}
              >
                Toggle Status
              </Button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};