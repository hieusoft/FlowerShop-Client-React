"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import "tailwindcss";

export function Hero({ className, ...props }: React.ComponentProps<"section">) {

    return <>
        <section className={cn(
            "min-h-[calc(80vh-8em)] border-b relative flex flex-col lg:flex-row items-stretch", 
            className
        )} {...props}>
        </section>
    </>;
}

export function HeroContent({ className, ...props }: React.ComponentProps<"div">) {
    return <>
        <div className={cn(
            "container z-1 mx-auto px-8 lg:pr-[40%] hy-4 flex flex-col gap-4 justify-end py-20 lg:py-[calc(8vh+2em)]", 
            className
        )} {...props}>
        </div>
    </>;
}

export function HeroMedia({ className, ...props }: React.ComponentProps<"div">) {
    return <>
        <div className={cn(
            "not-lg:container mx-auto lg:absolute max-h-120 lg:bottom-0 border border-b-0 rounded-t-[100dvw] overflow-hidden", 
            "lg:max-h-none lg:right-0 lg:left-[60%] lg:-top-24",
            className
        )} {...props}>
        </div>
    </>;
}