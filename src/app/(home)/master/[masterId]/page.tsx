import {getMasterById} from "@/actions/master-actions";
import {redirect} from "next/navigation";

interface MasterIdPageProps {
  params: {
    masterId: string;
  }
}

const MasterIdPage = async ({params}: MasterIdPageProps) => {
  const {masterId} = await params;
  let master = null;
  try {
    master = await getMasterById(masterId);
  } catch (err: any) {}
  if (master === null) redirect('/');

  return (
    <div className="container py-4 w-full mx-auto space-y-6">
      <h1 className="text-2xl lg:text-3xl font-black">Master {master.user.name}</h1>
      <div>
        <p className="text-md font-medium">
          <span className="font-bold">Profession:</span> {master.profession}
        </p>
        <p className="text-md font-medium text-balance">
          <span className="font-bold">Bio:</span> {master.bio}
        </p>
        <p className="font-bold text-md">Contacts:</p>
        {master.contact.map((c) => (
          <div key={c.id}>
            {c.name} - {c.value}
          </div>
        ))}
      </div>

      <h2 className="text-xl lg:text-2xl font-black">Schedule</h2>
      {/* TODO: Booking calendar */}
      {JSON.stringify(master.schedules, null, 2)}

    </div>
  );
};

export default MasterIdPage;