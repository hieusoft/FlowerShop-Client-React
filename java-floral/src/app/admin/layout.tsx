"use client";

import { Root } from "@/components/layouts/root"
import { AdminContext } from "@/components/providers/contexts/admin-context"
import { Providers } from "@/components/providers/providers"
import { ReactNode } from "react"

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <AdminContext value={{}}>
        <main>{children}</main>
    </AdminContext>
  )
}