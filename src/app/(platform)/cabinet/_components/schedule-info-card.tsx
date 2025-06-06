"use client"

import {useState} from "react";
import {cn} from "@/lib/utils";
import {Schedule, ScheduleStatus} from "@prisma/client";
import {Icons} from "@/components/common/icons";
import {formatDate, formatTime, getDurationHours} from "@/lib/calendar-utils";

interface ScheduleInfoCardProps {
  scheduleItem: Schedule
}


export const ScheduleInfoCard = ({scheduleItem}: ScheduleInfoCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      'border-2 p-2 space-y-2',
      scheduleItem.status === ScheduleStatus.FREE ? 'bg-green-100' : 'bg-red-100',
    )}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="grid grid-cols-2 gap-2 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Icons.calendar className="size-4"/>
          <div className="text-sm font-black">
            {formatDate(scheduleItem.startTime)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icons.clock className="size-4"/>
          <div className="text-sm font-black">
            {formatTime(scheduleItem.startTime)} - {formatTime(scheduleItem.endTime)}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="text-xs font-bold text-gray-600">
              Duration: {getDurationHours(scheduleItem.startTime, scheduleItem.endTime)}h
            </div>
            {scheduleItem.endTime.getDate() !== scheduleItem.startTime.getDate() && (
              <div className="text-xs font-bold text-red-600">SPANS TO: {formatDate(scheduleItem.endTime)}</div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className={cn(
              'flex items-center gap-2 rounded border-2 border-black px-2 py-1',
              scheduleItem.status === ScheduleStatus.FREE ? 'bg-green-200' : 'bg-red-200',
            )}>
              {scheduleItem.status === ScheduleStatus.FREE ? (
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
      )}


    </div>
  )
}