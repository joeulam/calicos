
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"


// Menu items.
export interface MenuItems {
  title: string,
  url: string,
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export function AppSidebar({items} : {items: MenuItems[]}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="text-2xl font-bold">Calico</SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item: MenuItems) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}