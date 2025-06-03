"use client"

import {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";
import {Icons} from "@/components/common/icons";
import {PRESET_INTERVALS} from "@/lib/calendar-utils";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface BrutCalendarDurationsControlsProps extends ComponentPropsWithoutRef<'div'> {
  onSetSelectedInterval: (value: number) => void;
  selectedInterval: number;
  customDuration: number | "";
  setCustomDuration: (durationHours: number | "") => void;

}

export const BrutCalendarDurationsControls = (
  {
    onSetSelectedInterval,
    selectedInterval,
    customDuration,
    setCustomDuration,
    className,
    ...props
  }: BrutCalendarDurationsControlsProps
) => {
  return (
    <div
      className={cn(
        'border-4 bg-neutral-100 p-4 space-y-4',
        className
      )}
      {...props}
    >
      <div className="mb-4 flex items-center gap-3">
        <Icons.clock className="size-6" />
        <h2 className="text-2xl font-bold uppercase">Pick Duration</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {PRESET_INTERVALS.map((interval) => (
          <Button
            key={interval.value}
            onClick={() => onSetSelectedInterval(interval.value)}
            variant={selectedInterval === interval.value && !customDuration ? 'elevated-primary' : 'elevated'}
          >
            {interval.label}
          </Button>
        ))}
      </div>

      <div>
        <div className="flex flex-col md:flex-row gap-2 md:justify-between md:items-center mb-4">
          <h3 className="text-lg font-semibold">Or Set custom time slot</h3>
          {customDuration && (
            <div className="border-2 bg-emerald-600 text-white px-4 py-2 text-sm font-black">
              Active: {customDuration}h
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          <Input
            type="number"
            step="0.25"
            min="0.25"
            max="24"
            value={customDuration}
            onChange={(e) => setCustomDuration(Number(e.target.value))}
            placeholder='Enter duration in hours'
          />
          <div className="text-lg font-black uppercase">Hours</div>

        </div>
      </div>

    </div>
  );
};