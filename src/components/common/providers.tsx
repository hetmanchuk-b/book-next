"use client";

import {SessionProvider} from "next-auth/react";
import {Toaster} from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({children}: ProvidersProps) => {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
};

export default Providers;