import NextAuth from "next-auth";
import {authOptions} from "@/auth";
import {UserRole} from "@prisma/client";

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}