"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import "tailwindcss";
import { Signature } from "./signature";

export function Header({}) {

    const [isScrolled, setIsScrolled] = useState(false);

    function handleDocumentScroll(event: Event) {
        console.log("scroll event fired");
        const scrollY = document.scrollingElement?.scrollTop ?? 0;
        console.log("scroll event fired", scrollY);
        setIsScrolled(scrollY > 0);
    }

    useEffect(() => {

        
        window.addEventListener("scroll", handleDocumentScroll);
        console.log("registered scroll event");

        return () => {
            window.removeEventListener("scroll", handleDocumentScroll);
            console.log("unregistered scroll event");
        }
    }, [])

    return <>
        <header className="sticky top-0 h-24 z-1000">
            <div className={cn(
                "transition-all duration-300 border-b border-transparent bg-transparent",
                isScrolled ? "border-border bg-background" : ""
            )}>
                <div className={cn(
                    "container mx-auto flex items-center h-24 px-8 transition-all duration-300",
                    isScrolled ? "h-16" : ""
                )}>
                    <Link href="/">
                        <h1>
                            <Signature />
                        </h1>
                    </Link>
                </div>
            </div>
        </header>
    </>;
}