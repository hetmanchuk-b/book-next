import {Schedule} from "@prisma/client";
import {ScheduleInfoCard} from "./schedule-info-card";
import {groupSchedulesByDay} from "@/lib/utils";
import {formatDate} from "@/lib/calendar-utils";

interface ScheduleInfoProps {
  schedule: Schedule[]
}

export const ScheduleInfo = ({schedule}: ScheduleInfoProps) => {
  const sortedSchedules = groupSchedulesByDay(schedule);

  return (
    <div className="space-y-4">
      {sortedSchedules.map((scheduleLine, index) => (
        <div>
          <p className="text-sm font-bold">{formatDate(scheduleLine[0].startTime)}</p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-start">
            {scheduleLine.map((slot) => (
              <ScheduleInfoCard
                key={slot.id}
                scheduleItem={slot}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


