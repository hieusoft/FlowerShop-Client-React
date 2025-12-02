"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import "tailwindcss";
import { Signature } from "./signature";
import { FacebookIcon, MailIcon, MapPinIcon, PhoneIcon, Twitter, TwitterIcon } from "lucide-react";
import { Separator } from "./separator";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export function Footer({}) {
    return <>
        <footer className="dark bg-popover text-popover-foreground mt-auto border-t border-border">
            <div className={cn(
                "container mx-auto flex px-8 py-8 gap-8",
                "flex-col md:flex-row"
            )}>
                <section className="md:basis-80">
                    <Link href="/">
                        <h2>
                            <Signature />
                        </h2>
                    </Link>
                    <Separator className="my-4" />
                    <address className="flex flex-col gap-1 *:flex *:items-center *:gap-2 *:pr-4 italic">
                        <span>
                            <MapPinIcon className="inline-block" size={18} absoluteStrokeWidth={true} aria-label="Address: " />
                            Somewhere, Mumbai, India
                        </span>
                        <span>
                            <PhoneIcon className="inline-block" size={18} absoluteStrokeWidth={true} aria-label="Phone number: " />
                            <a href="tel:+91 222 222222">
                                +91 222 222222
                            </a>
                        </span>
                        <span>
                            <MailIcon className="inline-block" size={18} absoluteStrokeWidth={true} aria-label="Email: " />
                            <a href="mailto:hello@javaflorist.example.com">
                                hello@javaflorist.example.com
                            </a>
                        </span>
                        <Separator className="my-3" />
                        <span>
                            <span className="flex gap-3">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a href="#">
                                            <SiFacebook aria-label="Facebook" title="" />
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Facebook
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a href="#">
                                            <SiX aria-label="X / Twitter" title="" />
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        X (formerly Twitter)
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <a href="#">
                                            <SiInstagram aria-label="Instagram" title="" />
                                        </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Instagram
                                    </TooltipContent>
                                </Tooltip>
                            </span>
                        </span>
                    </address>
                </section>
                
            </div>
        </footer>
    </>;
}