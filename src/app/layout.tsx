"use client";

import "./globals.css";
import { Root } from "@/components/layouts/root";
import { ReactNode } from "react";
import { Providers } from "@/components/providers/providers";
import { GlobalContext } from "@/components/providers/contexts/global-context";

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <Root>
      <Providers>
        <GlobalContext value={{ user: {} }}>
          {children}
        </GlobalContext>
      </Providers>
    </Root>
  )
}