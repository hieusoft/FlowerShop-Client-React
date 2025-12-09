"use client";

import { ReactNode } from "react";
import { UserContext, UserContextProvider } from "@/components/providers/contexts/user-context";
import { Header } from "@/components/blocks/layout/header";
import { Footer } from "@/components/blocks/layout/footer";

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <UserContextProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </UserContextProvider>
  )
}