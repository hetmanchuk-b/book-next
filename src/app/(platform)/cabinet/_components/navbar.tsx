import {Logo} from "@/components/common/logo";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";
import {CabinetMenu} from "@/app/(platform)/cabinet/_components/cabinet-menu";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }

  return (
    <div className="pl-3 sm:pl-6 h-20 flex border-b justify-between font-medium bg-white">
      <div className="flex gap-4">
        <Logo />
        <div className="text-sm self-end pb-4 hidden sm:block">Dashboard</div>
      </div>

      <div className="flex items-center pr-3 sm:pr-6 gap-4">

        <CabinetMenu name={user?.name || 'Unknown'} />
      </div>
    </div>
  );
};