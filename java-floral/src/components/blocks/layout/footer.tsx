"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import "tailwindcss";
import { Signature } from "../../ui/signature";
import { FacebookIcon, MailIcon, MapPinIcon, PhoneIcon, Twitter, TwitterIcon } from "lucide-react";
import { Separator } from "../../ui/separator";
import { SiBluesky, SiFacebook, SiInstagram, SiTumblr, SiX } from "@icons-pack/react-simple-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";

export function Footer({}) {
    return <>
        <footer className="dark bg-popover text-popover-foreground mt-auto border-t border-border">
            <div className={cn(
                "container mx-auto flex flex-col px-8 py-8 gap-8 text-sm"
            )}>
                <div className={cn(
                    "flex gap-8 md:gap-12 flex-col md:flex-row"
                )}>
                    <section className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5 shrink-0">
                        <Link href="/">
                            <h2>
                                <Signature />
                            </h2>
                        </Link>
                        <Separator className="my-4" />
                        <address className="flex flex-col gap-2 *:flex *:items-center *:gap-2 *:pr-4 italic">
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
                                <span className="flex gap-4">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href="#">
                                                <SiFacebook aria-label="Facebook" size={18} title="" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Facebook
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href="#">
                                                <SiBluesky aria-label="Bluesky" size={18} title="" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Bluesky
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href="#">
                                                <SiX aria-label="X (formerly Twitter)" size={18} title="" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            X (formerly Twitter)
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href="#">
                                                <SiInstagram aria-label="Instagram" size={18} title="" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Instagram
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <a href="#">
                                                <SiTumblr aria-label="Tumblr" size={18} title="" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Tumblr
                                        </TooltipContent>
                                    </Tooltip>
                                </span>
                            </span>
                        </address>
                    </section>
                    <section className="flex flex-wrap gap-8 grow *:basis-45">
                        <div className="flex flex-col items-stretch gap-2">
                            <h4 className="font-heading text-xl">Footer heading</h4>
                            <Link href="/">Footer link</Link>
                            <Link href="/">Footer link</Link>
                            <Link href="/">Footer link</Link>
                            <Link href="/">Footer link</Link>
                            <Link href="/">Footer link</Link>
                            <Link href="/">Footer link</Link>
                            <Link href="/">Footer link</Link>
                        </div>
                        <div className="flex flex-col items-stretch gap-2">
                            <h4 className="font-heading text-xl">About us</h4>
                            <Link href="/">About us</Link>
                            <Link href="/">FAQ</Link>
                            <Link href="/">Hiring</Link>
                        </div>
                        <div className="flex flex-col items-stretch gap-2">
                            <h4 className="font-heading text-xl">Legal</h4>
                            <Link href="/">Terms of service</Link>
                            <Link href="/">Privacy policy</Link>
                        </div>
                    </section>
                </div>
                <div className={cn(
                    "flex gap-8 flex-col md:flex-row"
                )}>
                    <div className="text-muted-foreground">
                        &copy; 2025 java Florist
                    </div>
                </div>
            </div>
        </footer>
    </>;
}