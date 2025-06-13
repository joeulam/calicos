import BottomNavBar from "@/components/bottom-nav";
import { AppSidebar } from "@/components/menu-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  LucideProps,
} from "lucide-react";
import { cookies } from "next/headers";
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
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  async function getUser(): Promise<UserSidebarData> {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const id = user!.id;

    const items = [
      { title: "Dashboard", url: `/${id}/dashboard`, icon: Home },
      { title: "Transaction", url: `/${id}/transaction`, icon: Inbox },
      { title: "Budgets", url: `/${id}/budget`, icon: Calendar },
      { title: "Reports", url: `/${id}/report`, icon: Search },
      { title: "Settings", url: `/${id}/settings`, icon: Settings },
    ];
    return { items, id };
  }

  const { items, id } = await getUser();

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}>
      <div className="flex">
        <div className="hidden lg:block">
          <AppSidebar items={items} />
        </div>
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <BottomNavBar userId={id} />
      </div>
    </SidebarProvider>
  );
}
