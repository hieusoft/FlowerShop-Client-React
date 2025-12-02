import { Footer } from "@/components/ui/footer";
import { Header } from "../components/ui/header";
import "./globals.css";
import { Root } from "@/components/layout/root";
import { ReactNode } from "react";
import { Providers } from "@/components/layout/providers";

export default function Layout({ children }: { 
    children: ReactNode
}) {
  return (
    <Root>
      <Providers>
        <Header />
        <main>{children}</main>
        <Footer />
      </Providers>
    </Root>
  )
}