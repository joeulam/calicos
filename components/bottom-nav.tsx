// components/ui/bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Transactions", href: "/transaction", icon: Inbox },
  { title: "Budgets", href: "/budget", icon: Calendar },
  { title: "Reports", href: "/report", icon: Search },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNavBar({ userId }: { userId: string }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white border-t px-4 py-2 shadow-md md:hidden">
      {navItems.map(({ title, href, icon: Icon }) => {
        const fullHref = `/${userId}${href}`;
        const isActive = pathname.startsWith(fullHref);

        return (
          <Link
            key={href}
            href={fullHref}
            className={clsx(
              "flex flex-col items-center text-xs",
              isActive ? "text-blue-600" : "text-gray-500"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            {title}
          </Link>
        );
      })}
    </nav>
  );
}
