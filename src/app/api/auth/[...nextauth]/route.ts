import NextAuth from "next-auth";
import {authOptions} from "@/auth";

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'ADMIN' | 'USER' | 'MASTER';
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}