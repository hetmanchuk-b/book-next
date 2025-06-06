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
    <div>
      <Link
        className={cn(buttonVariants({variant: 'link'}))}
        href={`/master/${master.id}`}
      >
        {master.user.name}
        <Icons.chevronRight className="size-6" />
      </Link>
    </div>
  );
};