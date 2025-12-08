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
} from "@/components/ui/sidebar";
import { Signature } from "@/components/ui/signature";
import { CommonSidebar, CommonSidebarItem } from "../layout/common-sidebar";
import Link from "next/link";
import {
  BadgeIcon,
  ChevronDownIcon,
  KeyIcon,
  PieChartIcon,
  ReceiptTextIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AdminSidebar({}) {
  return (
    <CommonSidebar homeLink="/admin">
      <SidebarContent className="p-2 **:data-[slot=sidebar-group]:p-0 **:data-[slot=collapsible-content]:*:data-[slot=sidebar-group-content]:pl-6">
        <SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <CommonSidebarItem
                href="/admin"
                name="Overview"
                icon={PieChartIcon}
              />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger>
                      <ReceiptTextIcon />
                      Sales
                      <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <CommonSidebarItem href="/admin/orders" name="Orders" />
                      <CommonSidebarItem
                        href="/admin/payments"
                        name="Payments"
                      />
                      <CommonSidebarItem
                        href="/admin/deliveries"
                        name="Deliveries"
                      />
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger>
                      <BadgeIcon />
                      Content
                      <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <CommonSidebarItem
                        href="/admin/bouquets"
                        name="Bouquets"
                      />
                      <CommonSidebarItem
                        href="/admin/occasions"
                        name="Occasions"
                      />
                      <CommonSidebarItem
                        href="/admin/grettings"
                        name="Greetings"
                      />
                      <CommonSidebarItem href="/admin/coupons" name="Coupons" />
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger>
                      <KeyIcon />
                      Access
                      <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <CommonSidebarItem href="/admin/users" name="Users" />
                      <CommonSidebarItem href="/admin/roles" name="Roles" />
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
    </CommonSidebar>
  );
}
