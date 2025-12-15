"use client";

import { AdminVerifier } from "@/components/providers/admin-verifier";
import "../globals.css";
import { ShipperSidebar } from "@/components/blocks/dashboard/shipper-sidebar";
import { AdminContext } from "@/components/providers/contexts/admin-context"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react"

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <AdminVerifier>
      {children}
    </AdminVerifier>
  )
}