import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";
import {Contact, Master, Schedule, User, UserRole} from "@prisma/client";
import {redirect} from "next/navigation";
import {getMaster} from "@/actions/master-actions";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {GeneralInfo} from "@/app/(platform)/cabinet/_components/general-info";
import {getMasterSchedule} from "@/actions/schedule-actions";
import {ScheduleInfo} from "@/app/(platform)/cabinet/_components/schedule-info";

const CabinetPage = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }
  if (!user || user.role !== UserRole.MASTER) redirect("/");

  const master = await getMaster();
  if (!master) redirect("/");

  const masterSchedule = await getMasterSchedule();

  return (
    <div className="container mx-auto py-4 space-y-4">
      <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">Profile Info</h1>
      </div>
      <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4">
        <h2 className="mb-4 text-start text-2xl font-semibold">General Info</h2>
        <Link href='/cabinet/edit' className={cn(buttonVariants({variant: 'link'}))}>
          Edit Info
        </Link>
      </div>
      <GeneralInfo
        user={user as User & {
          master: Master;
          contact: Contact[];
        }}
        master={master as {
          profession: string;
          bio: string;
          user: User;
        }}
      />
      <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4">
        <h2 className="mb-4 text-start text-2xl font-semibold">Schedule Info</h2>
        <Link href='/cabinet/schedule' className={cn(buttonVariants({variant: 'link'}))}>
          Edit Schedule
        </Link>
      </div>

      <ScheduleInfo schedule={masterSchedule as Schedule[]} />

    </div>
  );
};

export default CabinetPage;