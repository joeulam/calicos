import BottomNavBar from "@/components/bottom-nav";
import { AppSidebar } from "@/components/menu-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type SidebarItem = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type UserSidebarData = {
  items: SidebarItem[];
  id: string;
  initialDarkMode: boolean;
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user data
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("dark_mode_enabled")
    .eq("id", id)
    .single();

  let initialDarkMode = false;
  if (profileError) {
    console.error("Error fetching user profile for dark mode:", profileError);
  } else if (profile) {
    initialDarkMode = profile.dark_mode_enabled ?? false;
  }

  const items = [
    { title: "Dashboard", url: `/${id}/dashboard`, icon: Home },
    { title: "Transaction", url: `/${id}/transaction`, icon: Inbox },
    { title: "Budgets", url: `/${id}/budget`, icon: Calendar },
    { title: "Reports", url: `/${id}/report`, icon: Search },
    { title: "Settings", url: `/${id}/settings`, icon: Settings },
  ];

  return (
    <ThemeProvider initialDarkMode={initialDarkMode}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex">
          <div className="hidden lg:block">
            <AppSidebar items={items} />
          </div>
          <main className="flex-1 overflow-x-hidden pb-16 lg:pb-0">
            {children}
          </main>
          <BottomNavBar userId={id} />
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
