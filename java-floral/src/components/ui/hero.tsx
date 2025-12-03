"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import "tailwindcss";

export function Hero({ className, ...props }: React.ComponentProps<"section">) {

    return <>
        <section className={cn(
            "min-h-[calc(80vh-8em)] border-b relative flex items-stretch", 
            className
        )} {...props}>
        </section>
    </>;
}

export function HeroContent({ className, ...props }: React.ComponentProps<"div">) {
    return <>
        <div className={cn(
            "container mx-auto px-8 hy-4 flex flex-col gap-4 justify-end py-[calc(8vh+2em)]", 
            className
        )} {...props}>
        </div>
    </>;
}

export function HeroRedis({ className, ...props }: React.ComponentProps<"div">) {
    return <>
        <div className={cn(
            "container mx-auto px-8 hy-4 flex flex-col gap-4 justify-end py-[calc(8vh+2em)]", 
            className
        )} {...props}>
        </div>
    </>;
}