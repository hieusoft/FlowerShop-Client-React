"use client";

import { AdminSidebar } from "@/components/blocks/layout/admin-sidebar";
import { Root } from "@/components/layouts/root"
import { AdminContext } from "@/components/providers/contexts/admin-context"
import { Providers } from "@/components/providers/providers"
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react"

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <AdminContext value={{}}>
        <SidebarProvider>
            <AdminSidebar />
            <main>{children}</main>
        </SidebarProvider>
    </AdminContext>
  )
}