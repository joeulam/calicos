import BottomNavBar from "@/components/bottom-nav";
import { AppSidebar } from "@/components/menu-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { Home, Inbox, Calendar, Search, Settings } from "lucide-react";
import { cookies } from "next/headers";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const getUser = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const id = user.id;

    const items = [
      { title: "Dashboard", url: `/${id}/dashboard`, icon: Home },
      { title: "Transaction", url: `/${id}/transaction`, icon: Inbox },
      { title: "Budgets", url: `/${id}/budget`, icon: Calendar },
      { title: "Reports", url: `/${id}/report`, icon: Search },
      { title: "Settings", url: `/${id}/settings`, icon: Settings },
    ];
    return { items, id };
  };

  const { items, id } = await getUser();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
  <div className="flex">
    {/* Sidebar only on desktop */}
    <div className="hidden md:block">
      <AppSidebar items={items} />
    </div>

    {/* Main content */}
    <main className="flex-1 pb-16 md:pb-0">{children}</main>

    {/* Bottom Nav only on mobile */}
    <BottomNavBar userId={id} />
  </div>

  {/* Sidebar toggle only on desktop */}
  <div className="hidden md:block">
    <SidebarTrigger />
  </div>
</SidebarProvider>

  );
}
