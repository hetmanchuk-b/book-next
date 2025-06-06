import {BrutCalendar} from "@/components/calendar/brut-calendar";
import {TimeSlot} from "@/lib/calendar-utils";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";
import {UserRole} from "@prisma/client";
import {redirect} from "next/navigation";
import {getMaster} from "@/actions/master-actions";
import {
  createScheduleSlot,
  deleteScheduleSlot,
  getMasterSchedule,
  updateScheduleSlotStatus
} from "@/actions/schedule-actions";

const CabinetSchedulePage = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }
  if (!user || user.role !== UserRole.MASTER) redirect("/");

  const master = await getMaster();

  if (!master) redirect("/");

  const initialSlots = await getMasterSchedule();

  const slots: TimeSlot[] = initialSlots.map((slot) => ({
    id: slot.id,
    startDate: new Date(slot.startTime),
    endDate: new Date(slot.endTime),
    status: slot.status
  }))

  return (
    <div className="container mx-auto w-full py-4">
      <BrutCalendar
        slots={slots}
        onCreateSlot={createScheduleSlot}
        onUpdateSlot={updateScheduleSlotStatus}
        onDeleteSlot={deleteScheduleSlot}
      />
    </div>
  );
};

export default CabinetSchedulePage;