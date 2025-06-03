import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser} from "@/actions/user-actions";
import {redirect} from "next/navigation";
import {UserRole} from "@prisma/client";
import {getMaster} from "@/actions/master-actions";
import {EditMasterProfileForm} from "@/app/(platform)/cabinet/_components/edit-master-profile-form";

const CabinetEditPage = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }
  if (!user || user.role !== UserRole.MASTER) redirect("/");

  const master = await getMaster();

  if (!master) redirect("/");

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Configure Profile Info</h1>
      <EditMasterProfileForm
        initialData={{
          name: master?.user.name || '',
          profession: master.profession || '',
          bio: master.bio || '',
          contacts: master.user?.contact || []
        }}
      />
    </div>
  );
};

export default CabinetEditPage;