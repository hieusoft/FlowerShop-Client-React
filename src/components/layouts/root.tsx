import Head from "next/head";
import { ReactNode } from "react";
import { Toaster } from "../ui/sonner";


export function Root({ children }: {
    children: ReactNode
}) {
    return (
        <html suppressHydrationWarning>
            {/* eslint-disable-next-line @next/next/no-head-element */}
            <head>
                <title>java Florist</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* eslint-disable-next-line @next/next/no-page-custom-font */}
                <link href="https://fonts.googleapis.com/css2?family=Crete+Round:ital@0;1&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
            </head>
            <body className="flex flex-col min-h-lvh">
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    )
}