import { Sidebar, SidebarHeader, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Signature } from "@/components/ui/signature";
import { IconType } from "@icons-pack/react-simple-icons";
import { SidebarClose } from "lucide-react";
import Link from "next/link";
import React from "react";

export function CommonSidebar(
  { homeLink, children }: { 
    homeLink: string, 
    children?: React.ReactNode 
  }
) {
    return <Sidebar>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="py-1 h-auto"
          >
            <Link href={homeLink}>
              <Signature />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {children}
      </SidebarHeader>
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