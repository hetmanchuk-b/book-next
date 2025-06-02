import {cn} from "@/lib/utils";
import {siteConfig} from "@/config/site";
import Link from "next/link";
import {Inter} from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  weight: ['700']
});

export const Logo = () => {
  return (
    <Link href='/' className="flex items-center">
      <span className={cn(inter.className, 'text-3xl md:text-5xl font-semibold tracking-tighter')}>
        {siteConfig.name}
      </span>
    </Link>
  );
};