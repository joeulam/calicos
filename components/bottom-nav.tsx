"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Inbox, Calendar, Search, Settings, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Transactions", href: "/transaction", icon: Inbox },
  { title: "Budgets", href: "/budget", icon: Calendar },
  { title: "Reports", href: "/report", icon: Search },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNavBar({ userId }: { userId: string }) {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    toggleDarkMode(!isDarkMode);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white dark:bg-gray-800 border-t dark:border-gray-700 px-4 py-2 shadow-md lg:hidden items-center">
      {navItems.map(({ title, href, icon: Icon }) => {
        const fullHref = `/${userId}${href}`;
        const isActive = pathname.startsWith(fullHref);

        return (
          <Link
            key={href}
            href={fullHref}
            className={clsx(
              "flex flex-col items-center text-xs",
              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
            )}
          >
            <Icon className="w-5 h-5 mb-1" />
            {title}
          </Link>
        );
      })}
      <button
        onClick={handleThemeToggle}
        className="flex flex-col items-center text-xs text-gray-500 dark:text-gray-400"
      >
        {mounted ? (
          isDarkMode ? (
            <Sun className="w-5 h-5 mb-1 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 mb-1 text-indigo-700" />
          )
        ) : (
          <div className="w-5 h-5 mb-1" />
        )}
        Theme
      </button>
    </nav>
  );
}