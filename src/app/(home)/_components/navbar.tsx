import {Logo} from "@/components/common/logo";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {SignOutButton} from "@/app/(home)/_components/sign-out-button";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";
import {UserRole} from "@prisma/client";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }

  return (
    <div className="pl-3 sm:pl-6 h-20 flex border-b justify-between font-medium bg-white">
      <Logo />

      <div className="flex items-center pr-3 sm:pr-6 gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div>{user.role}</div>
            </div>
            {user.role === UserRole.MASTER ? (
              <Link
                href="/cabinet"
                className={cn(buttonVariants({variant: 'elevated-primary'}))}
              >
                Cabinet
              </Link>
            ) : (
              <Link
                href="/become-master"
                className={cn(buttonVariants({variant: 'elevated-primary'}))}
              >
                Become Master
              </Link>
            )}
            <SignOutButton />
          </div>
        ) : (
          <Link href="/login" className={cn(buttonVariants({variant: 'elevated'}))}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};