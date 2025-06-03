"use client";

import {signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {ComponentProps} from "react";

type SignOutButtonProps = ComponentProps<typeof Button>;

export const SignOutButton = ({...props}: SignOutButtonProps) => {
  return (
    <Button onClick={() => signOut()} variant="elevated" {...props}>
      Sign Out
    </Button>
  );
};