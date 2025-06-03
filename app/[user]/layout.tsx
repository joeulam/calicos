import { cookies } from "next/headers";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, MenuItems } from "@/components/menu-bar";
import { Calendar, Home, Inbox, LogOut, Search, Settings } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const getUser = async () => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if(!user){
      return []
    }
    const id = user?.id;

    const items = [
      {
        title: "Dashboard",
        url: `/${id}/dashboard`,
        icon: Home,
      },
      {
        title: "Transaction",
        url: `/${id}/transaction`,
        icon: Inbox,
      },
      {
        title: "Calendar",
        url: "#",
        icon: Calendar,
      },
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings,
      },
      {
        title: "Logout",
        url: "/logout",
        icon: LogOut,
      },
    ];
    return items as MenuItems[];
  };

  const items = await getUser();
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar items={items} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
