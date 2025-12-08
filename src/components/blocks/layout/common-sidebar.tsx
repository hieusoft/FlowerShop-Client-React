"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Signature } from "@/components/ui/signature";
import { IconType } from "@icons-pack/react-simple-icons";
import { ChevronUpIcon, SidebarClose, User2Icon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export function CommonSidebar(
  { homeLink, children }: { 
    homeLink: string, 
    children?: React.ReactNode 
  }
) {
    useEffect(() => {
        document.documentElement.classList.add("dashboard");
        return () => {
            document.documentElement.classList.remove("dashboard");
        }
    }, [])

    return <Sidebar className="dark text-sidebar-foreground">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="py-1 h-auto items-baseline"
          >
            <Link href={homeLink}>
              <Signature />
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      {children}
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User2Icon /> Username
              <ChevronUpIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-(--radix-popper-anchor-width)"
          >
            <DropdownMenuItem asChild>
              <Link href="/">
                Return to main website
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
}

export function CommonSidebarItem(
  { name, href, icon }: {
    name: string,
    href: string,
    icon?: IconType
  }
) {
  const Icon = icon;
  return <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <Link href={href}>
        {Icon && <Icon />}
        {name}
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
}