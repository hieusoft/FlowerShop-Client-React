"use client";

import { ShipperSidebar } from "@/components/blocks/layout/shipper-sidebar";
import { AdminContext } from "@/components/providers/contexts/admin-context"
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react"

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <AdminContext value={{}}>
        <SidebarProvider>
            <ShipperSidebar />
            <main>{children}</main>
        </SidebarProvider>
    </AdminContext>
  )
}