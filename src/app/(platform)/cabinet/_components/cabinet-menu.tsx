"use client";

import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Icons} from "@/components/common/icons";
import {SignOutButton} from "@/app/(home)/_components/sign-out-button";
import {useState} from "react";

interface CabinetMenuProps {
  name: string
}

interface CabinetMenuItemProps {
  href: string;
  name: string;
  icon: keyof typeof Icons;
  onOpenChange: (isExpanded: boolean) => void;
}

const cabinetNav = [
  {
    href: '/cabinet',
    name: 'Cabinet',
    icon: 'home'
  },
  {
    href: '/cabinet/edit',
    name: 'Manage Profile',
    icon: 'settings'
  },
  {
    href: '/cabinet/schedule',
    name: 'Schedule',
    icon: 'schedule'
  },
  {
    href: '/cabinet/bookings',
    name: 'Bookings',
    icon: 'booking'
  },
];

export const CabinetMenu = ({name}: CabinetMenuProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <DropdownMenu open={isExpanded} onOpenChange={setIsExpanded}>
      <DropdownMenuTrigger asChild>
        <Button variant='elevated'>Hello, <span className="font-semibold">{name}</span></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col">
          {cabinetNav.map((item) => (
            <CabinetMenuItem
              onOpenChange={setIsExpanded}
              key={item.href}
              href={item.href}
              name={item.name}
              icon={item.icon as keyof typeof Icons}
            />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <SignOutButton className="w-full" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CabinetMenuItem = ({href, name, icon, onOpenChange}: CabinetMenuItemProps) => {
  const Icon = Icons[icon];
  return (
    <DropdownMenuItem className="p-0">
      <Link
        href={href}
        onClick={() => onOpenChange(false)}
        className={cn(
          buttonVariants({variant: 'outline'}),
          'justify-between rounded-none w-full -mb-px'
        )}
      >
        {name}
        <Icon className="size-5" />
      </Link>
    </DropdownMenuItem>
  )
}