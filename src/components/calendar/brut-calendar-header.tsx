import {ComponentPropsWithoutRef} from "react";
import {cn} from "@/lib/utils";

export const BrutCalendarHeader = ({className, ...props}: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      className={cn('border-4 bg-neutral-100 py-4 px-2', className)}
      {...props}
    >
      <h2 className="font-black text-2xl lg:text-4xl text-center uppercase">Add schedule to your Calendar</h2>
    </div>
  );
}