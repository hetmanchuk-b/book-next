import {Navbar} from "./_components/navbar";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";
import {UserRole} from "@prisma/client";
import {redirect} from "next/navigation";

interface CabinetLayoutProps {
  children: React.ReactNode
}

const CabinetLayout = async ({children}: CabinetLayoutProps) => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }
  if (user?.role !== UserRole.MASTER) return redirect("/");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow bg-neutral-200 px-3 flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default CabinetLayout;