import {Contact, Master, User} from "@prisma/client";

interface GeneralInfoProps {
  user: User & {
    master: Master;
    contact: Contact[];
  };
  master: {
    profession: string;
    bio: string;
    user: User;
  }
}

export const GeneralInfo = ({user, master}: GeneralInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      <div className="space-y-3">
        <div className="space-y-1 bg-white p-2 rounded-sm border">
          <p className="font-medium text-sm text-gray-700">Name</p>
          <p className="text-base font-bold">{user.name}</p>
        </div>
        <div className="space-y-1 bg-white p-2 rounded-sm border">
          <p className="font-medium text-sm text-gray-700">Profession</p>
          {master.profession ? (
            <p className="text-base font-bold">{master.profession}</p>
          ) : (
            <p className="text-base text-gray-700 font-medium">No profession.</p>
          )}
        </div>
        <div className="space-y-1 bg-white p-2 rounded-sm border">
          <p className="font-medium text-sm text-gray-700">Bio</p>
          {master.bio ? (
            <p className="text-base font-bold">{master.bio}</p>
          ) : (
            <p className="text-base text-gray-700 font-medium">No bio.</p>
          )}
        </div>
      </div>
      <div className="space-y-3 bg-white p-2 rounded-sm border">
        <p className="text-md font-semibold">Contacts list</p>
        {user.contact.length ? user.contact.map((contact) => (
          <div key={contact.id} className="bg-neutral-100 p-2 rounded-sm border">
            <p className="font-medium text-sm text-gray-700">{contact.name}</p>
            <p className="text-base font-bold">{contact.value}</p>
          </div>
        )) : (
          <p className="text-base text-gray-700 font-medium">No contacts.</p>
        )}
      </div>
    </div>
  );
};