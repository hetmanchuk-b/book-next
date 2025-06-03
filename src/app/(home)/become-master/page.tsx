import {getServerSession} from "next-auth";
import {authOptions} from "@/auth";
import {getUser, updateRoleToMaster} from "@/actions/user-actions";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";

const BecomeMasterPage = async () => {
  const session = await getServerSession(authOptions);
  let user = null;
  if (session?.user?.id) {
    user = await getUser();
  }
  if (!user) return redirect("/login");

  return (
    <div className="w-full h-full">
      <form
        action={async () => {
          "use server"
          await updateRoleToMaster();
          redirect('/cabinet/edit');
        }}
      >
        <Button type='submit' variant='elevated-primary'>Create Master Profile</Button>
      </form>
    </div>
  );
};

export default BecomeMasterPage;