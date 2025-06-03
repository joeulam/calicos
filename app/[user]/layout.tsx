import { cookies } from "next/headers"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/menu-bar"
import { createClient } from "@/util/client"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  const getUser = async() => {
    const supabase = createClient();
    const {data} = await supabase.auth.getUser()
    const id = data.user?.id
    console.log(data)

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
    ]
    return items
  }

  const items = await getUser()
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar items={items}/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}