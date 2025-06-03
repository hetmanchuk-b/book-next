import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";
import {UserRole} from "@prisma/client";
import {redirect} from "next/navigation";
import {getMaster} from "@/actions/master-actions";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";

const CabinetPage = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }
  if (!user || user.role !== UserRole.MASTER) redirect("/");

  const master = await getMaster();

  if (!master) redirect("/");

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold">Profile Info</h1>
      </div>
      <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4">
        <h2 className="mb-4 text-start text-2xl font-semibold">General Info</h2>
        <Link href='/cabinet/edit' className={cn(buttonVariants({variant: 'link'}))}>
          Edit Info
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="space-y-3">
          <div className="space-y-1 bg-white p-2 rounded-sm border">
            <p className="font-medium text-sm text-gray-700">Name</p>
            <p className="text-base font-bold">{user.name}</p>
          </div>
          <div className="space-y-1 bg-white p-2 rounded-sm border">
            <p className="font-medium text-sm text-gray-700">Profession</p>
            {master.profession ? (
              <p className="text-base font-bold">{master.profession}</p>
            ) : (
              <p className="text-base text-gray-700 font-medium">No profession.</p>
            )}
          </div>
          <div className="space-y-1 bg-white p-2 rounded-sm border">
            <p className="font-medium text-sm text-gray-700">Bio</p>
            {master.bio ? (
              <p className="text-base font-bold">{master.bio}</p>
            ) : (
              <p className="text-base text-gray-700 font-medium">No bio.</p>
            )}
          </div>
        </div>
        <div className="space-y-3 bg-white p-2 rounded-sm border">
          <p className="text-md font-semibold">Contacts list</p>
          {user.contact.length ? user.contact.map((contact) => (
            <div key={contact.id} className="bg-neutral-100 p-2 rounded-sm border">
              <p className="font-medium text-sm text-gray-700">{contact.name}</p>
              <p className="text-base font-bold">{contact.value}</p>
            </div>
          )) : (
            <p className="text-base text-gray-700 font-medium">No contacts.</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4">
        <h2 className="mb-4 text-start text-2xl font-semibold">Schedule Info</h2>
        <Link href='/cabinet/schedule' className={cn(buttonVariants({variant: 'link'}))}>
          Edit Schedule
        </Link>
      </div>
    </div>
  );
};

export default CabinetPage;