import {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";
import {DAYS, HOURS, TimeSlot} from "@/lib/calendar-utils";

interface BrutCalendarGridProps extends ComponentPropsWithoutRef<'div'> {
  weekDates: Date[];
  onTimeSlotClick: (day: number, hour: number) => void;
  isSlotSelected: (day: number, hour: number) => boolean;
  getSlotColor: (day: number, hour: number) => string;
  selectedSlots: TimeSlot[];
}

export const BrutCalendarGrid = (
  {
    weekDates,
    getSlotColor,
    onTimeSlotClick,
    isSlotSelected,
    selectedSlots,
    className,
    ...props
  }: BrutCalendarGridProps
) => {
  return (
    <div
      className={cn(
        'min-w-3xl',
        className
      )}
      {...props}
    >
      <BrutCalendarGridRow
        weekDates={weekDates}
      />
      <BrutCalendarGridTimeSlots
        selectedSlots={selectedSlots}
        getSlotColor={getSlotColor}
        isSlotSelected={isSlotSelected}
        weekDates={weekDates}
        onTimeSlotClick={onTimeSlotClick}
      />
    </div>
  );
};

interface BrutCalendarGridTimeSlotsProps extends ComponentPropsWithoutRef<'div'> {
  weekDates: Date[];
  onTimeSlotClick: (day: number, hour: number) => void;
  isSlotSelected: (day: number, hour: number) => boolean;
  getSlotColor: (day: number, hour: number) => string;
  selectedSlots: TimeSlot[];
}

const BrutCalendarGridTimeSlots = (
  {
    onTimeSlotClick,
    selectedSlots,
    isSlotSelected,
    getSlotColor,
    weekDates,
    className,
    ...props
  }: BrutCalendarGridTimeSlotsProps
) => {
  return (
    <div
      className={cn(
        'max-h-124 w-full',
        className
      )}
      {...props}
    >
      {HOURS.map((hour) => (
        <div key={hour} className="grid grid-cols-8 border-b-2 last:border-b-0">
          <div className="border-r-2 bg-neutral-100 p-3">
            <div className="text-sm font-black">{hour.toString().padStart(2, '0')}:00</div>
          </div>
          {weekDates.map((day, dayIndex) => (
            <button
              key={dayIndex}
              onClick={() => onTimeSlotClick(dayIndex, hour)}
              className={cn(
                'cursor-pointer border-r-2 p-3 text-sm font-bold transition-colors last:border-r-0 bg-white hover:bg-neutral-200',
                isSlotSelected(dayIndex, hour) && 'bg-emerald-500 text-white hover:bg-emerald-700',
                getSlotColor(dayIndex, hour)
              )}
            >
              {isSlotSelected(dayIndex, hour) ? (
                <span>{hour.toString().padStart(2, '0')}:00</span>
              ) : null}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

interface BrutCalendarGridRowProps extends ComponentPropsWithoutRef<'div'> {
  weekDates: Date[];
}

const BrutCalendarGridRow = (
  {
    weekDates,
    className,
    ...props
  }: BrutCalendarGridRowProps
) => {
  return (
    <div
      className={cn(
        'grid grid-cols-8 w-full',
        className
      )}
      {...props}
    >
      <div className="border-r-2 bg-emerald-300 p-4 flex items-center justify-center">
        <span className="text-lg font-black uppercase">Time</span>
      </div>
      {weekDates.map((date, index) => (
        <div
          key={index}
          className="border-r-2 bg-blue-300 p-4 flex flex-col items-center justify-center last:border-r-0"
        >
          <div className="text-lg font-black uppercase">{DAYS[index]}</div>
          <div className="text-sm font-bold">
            {date.getDate()}/{date.getMonth() + 1}
          </div>
        </div>
      ))}
    </div>
  )
}