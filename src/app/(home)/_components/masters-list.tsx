import {PublicMasterInfo} from "@/types/general";
import {MastersListItem} from "@/app/(home)/_components/masters-list-item";

interface MastersListProps {
  masters: PublicMasterInfo[];
}

export const MastersList = ({masters}: MastersListProps) => {
  return (
    <div className="space-y-4">
      {masters.map((master) => (
        <MastersListItem
          key={master.id}
          master={master}
        />
      ))}
    </div>
  );
};