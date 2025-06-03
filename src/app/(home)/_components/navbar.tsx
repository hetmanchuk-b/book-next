"use client"

import {Logo} from "@/components/common/logo";
import {useSession, signOut} from "next-auth/react";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export const Navbar = () => {
  const {data: session} = useSession();
  return (
    <div className="pl-6 h-20 flex border-b justify-between font-medium bg-white">
      <Logo />

      <div className="flex items-center pr-6 gap-4">
        {session ? (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {session.user?.name && <div>{session.user.name}</div>}
              <div>{session.user?.email}</div>
            </div>
            <Button onClick={() => signOut()} variant="elevated">
              Sign Out
            </Button>
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