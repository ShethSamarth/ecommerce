import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar"

import { UserButton } from "./user-button"

export const MainSidebar = async () => {
  const user = {
    name: "Samarth Sheth",
    email: "samarth.sheth.29@gmail.com",
    avatar: "/person.svg"
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent />
      <SidebarFooter>
        <UserButton user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
