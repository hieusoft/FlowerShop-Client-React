"use client";

import "../globals.css";
import { AdminSidebar } from "@/components/blocks/dashboard/admin-sidebar";
import { Root } from "@/components/layouts/root"
import { AdminContext, AdminContextProvider } from "@/components/providers/contexts/admin-context"
import { Providers } from "@/components/providers/providers"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react"

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <AdminContextProvider>
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
              {children}
            </SidebarInset>
        </SidebarProvider>
    </AdminContextProvider>
  )
}