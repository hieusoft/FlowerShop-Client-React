"use client";

import { ReactNode } from "react";
import { UserContext } from "@/components/providers/contexts/user-context";
import { Header } from "@/components/blocks/layout/header";
import { Footer } from "@/components/blocks/layout/footer";

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <UserContext value={{
      cart: []
    }}>
      <Header />
      <main>{children}</main>
      <Footer />
    </UserContext>
  )
}