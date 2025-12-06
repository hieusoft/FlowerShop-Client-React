import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Signature } from "@/components/ui/signature";
import { CommonSidebar, CommonSidebarItem } from "../layout/common-sidebar";
import Link from "next/link";
import { PieChartIcon } from "lucide-react";

export function AdminSidebar({}) {
  return <CommonSidebar homeLink="/admin">
    <SidebarContent className="*:p-0">
      <SidebarGroup>
        <SidebarGroupLabel>
          Admin
        </SidebarGroupLabel>
        <SidebarMenu>
          <CommonSidebarItem href="/admin" name="Overview" icon={PieChartIcon} />
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>
          Content
        </SidebarGroupLabel>
        <SidebarMenu>
          <CommonSidebarItem href="/admin/bouquets" name="Bouquets" />
          <CommonSidebarItem href="/admin/occasions" name="Occasions" />
          <CommonSidebarItem href="/admin/grettings" name="Greetings" />
          <CommonSidebarItem href="/admin/coupons" name="Coupons" />
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>
          Orders
        </SidebarGroupLabel>
        <SidebarMenu>
          <CommonSidebarItem href="/admin/orders" name="Orders" />
          <CommonSidebarItem href="/admin/payments" name="Payments" />
          <CommonSidebarItem href="/admin/deliveries" name="Deliveries" />
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>
          Users
        </SidebarGroupLabel>
        <SidebarMenu>
          <CommonSidebarItem href="/admin/users" name="Users" />
          <CommonSidebarItem href="/admin/roles" name="Roles" />
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </CommonSidebar>
}