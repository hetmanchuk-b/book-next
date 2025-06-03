"use client";

import {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/common/icons";
import {formatDate} from "@/lib/calendar-utils";

interface BrutCalendarWeekNavProps extends ComponentPropsWithoutRef<'div'> {
  onNavigateWeek: (val: -1 | 1) => void;
  weekDates: Date[];
}

export const BrutCalendarWeekNav = (
  {
    onNavigateWeek,
    weekDates,
    className,
    ...props
  }: BrutCalendarWeekNavProps
) => {
  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-2 md:gap-3 items-center bg-neutral-100 md:justify-between border-4 p-4',
        className
      )}
      {...props}
    >
      <Button
        onClick={() => onNavigateWeek(-1)}
        type="button"
        variant='elevated'
        size='icon'
        className="size-12 border-2"
      >
        <span className="sr-only">Prev week</span>
        <Icons.chevronLeft className="size-8" />
      </Button>
      <div className="text-center text-xl md:text-2xl font-black uppercase">
        {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
      </div>
      <Button
        onClick={() => onNavigateWeek(1)}
        type="button"
        variant='elevated'
        size='icon'
        className="size-12 border-2"
      >
        <span className="sr-only">Next week</span>
        <Icons.chevronRight className="size-8" />
      </Button>
    </div>
  );
};