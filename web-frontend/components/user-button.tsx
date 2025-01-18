"use client"

import { toast } from "sonner"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { getCookie } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type UserButtonProps = {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter()
  const { isMobile } = useSidebar()

  const handleSignOut = async () => {
    try {
      const refreshToken = getCookie("refreshToken")

      const response = await apiClient.post("/api/admin/sign-out", {
        refreshToken
      })

      if (response instanceof AxiosError) throw response

      toast.success("Logout Successful", {
        description: "Redirecting to login page."
      })

      router.refresh()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error[0].name ?? "Internal Error", {
          description: error.response?.data.error[0].message
        })
      } else {
        toast.error("Network Error", { description: "Please try again later." })
      }
    }
  }

  const handleSignOutAllSession = async () => {
    try {
      const refreshToken = getCookie("refreshToken")

      const response = await apiClient.post(
        "/api/admin/sign-out-all-sessions",
        { refreshToken }
      )

      if (response instanceof AxiosError) throw response

      toast.success("Logout Successful", {
        description: "Redirecting to login page."
      })

      router.refresh()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error[0].name ?? "Internal Error", {
          description: error.response?.data.error[0].message
        })
      } else {
        toast.error("Network Error", { description: "Please try again later." })
      }
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOutAllSession}>
              <LogOut />
              Log out all sessions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
