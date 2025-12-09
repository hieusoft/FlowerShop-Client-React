"use client";

import "./globals.css";
import { Root } from "@/components/layouts/root";
import { ReactNode } from "react";
import { Providers } from "@/components/providers/providers";
import { GlobalContext, GlobalContextProvider } from "@/components/providers/contexts/global-context";

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <Root>
      <Providers>
        <GlobalContextProvider>
          {children}
        </GlobalContextProvider>
      </Providers>
    </Root>
  )
}