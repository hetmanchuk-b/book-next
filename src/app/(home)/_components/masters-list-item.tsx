import {PublicMasterInfo} from "@/types/general";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Icons} from "@/components/common/icons";

interface MastersListItemProps {
  master: PublicMasterInfo
}

export const MastersListItem = ({master}: MastersListItemProps) => {
  return (
    <div className="border-2 p-4 bg-white">
      <div className="flex items-center gap-2 flex-col lg:flex-row">
        <Link
          className={cn(buttonVariants({variant: 'link'}))}
          href={`/master/${master.id}`}
        >
          {master.user.name}
          <Icons.chevronRight className="size-6" />
        </Link>
        <div className="space-y-1">
          <p className="font-semibold text-sm">
            Profession: {master.profession}
          </p>
          <p className="text-sm">
            Bio: {master.bio.slice(0, 50)}{master.bio.length >= 50 && '...'}
          </p>
        </div>
      </div>
    </div>
  );
};