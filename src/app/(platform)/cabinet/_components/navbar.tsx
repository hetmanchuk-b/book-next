import {Logo} from "@/components/common/logo";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {SignOutButton} from "@/app/(home)/_components/sign-out-button";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }

  return (
    <div className="pl-6 h-20 flex border-b justify-between font-medium bg-white">
      <div className="flex gap-4">
        <Logo />
        <div className="text-sm self-end pb-4">Dashboard</div>
      </div>

      <div className="flex items-center pr-6 gap-4">
        <div className="text-base text-gray-800">
          <div>Hello, {user?.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/cabinet/bookings"
            className={cn(buttonVariants({variant: 'elevated-primary'}))}
          >
            Bookings
          </Link>
          <Link
            href="/cabinet/schedule"
            className={cn(buttonVariants({variant: 'elevated-primary'}))}
          >
            Schedule
          </Link>
          <Link
            href="/cabinet/edit"
            className={cn(buttonVariants({variant: 'elevated-primary'}))}
          >
            Manage Profile
          </Link>
          <Link
            href="/cabinet"
            className={cn(buttonVariants({variant: 'elevated-primary'}))}
          >
            Cabinet
          </Link>
          <SignOutButton/>
        </div>
      </div>
    </div>
  );
};