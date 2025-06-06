import {getPublicMasters} from "@/actions/master-actions";
import {MastersList} from "@/app/(home)/_components/masters-list";

export default async function Home() {

  const masters = await getPublicMasters();

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <MastersList
        masters={masters}
      />
    </div>
  );
}
