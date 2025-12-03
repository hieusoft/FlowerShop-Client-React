"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import "tailwindcss";
import { Signature } from "./signature";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./navigation-menu";
import { Button } from "./button";
import { SearchIcon, ShoppingBasketIcon, UserIcon } from "lucide-react";
import { Badge } from "./badge";

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

        return () => {
            window.removeEventListener("scroll", handleDocumentScroll);
        }
    }, [])

    return <>
        <header className="sticky top-0 h-24 z-1000">
            <div className={cn(
                "transition-all duration-300 border-b border-transparent bg-transparent",
                isScrolled ? "border-border bg-background" : ""
            )}>
                <div className={cn(
                    "container mx-auto flex items-center h-24 px-8 transition-all duration-300 relative",
                    isScrolled ? "h-16" : ""
                )}>
                    <Link href="/">
                        <h1>
                            <Signature />
                        </h1>
                    </Link>
                    <NavigationMenu className="flex-1 ml-4 max-w-none *:first:w-full">
                        <NavigationMenuList className="flex-wrap">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Bouquets</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex gap-4 w-max max-w-dvw">
                                        <div className="flex flex-col">
                                            <h3 className="font-heading px-2 py-1 text-2xl">For those special moments</h3>
                                            <NavigationMenuLink asChild>
                                                <Link href="/">
                                                    Birthdays
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="/">
                                                    Anniversaries
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="/">
                                                    Weddings
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link className="text-muted-foreground italic" href="/">
                                                    More occasions...
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>Flowers</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex gap-4 w-max max-w-dvw">
                                        <div className="flex flex-col">
                                            <h3 className="font-heading px-2 py-1 text-2xl">Browse our garden</h3>
                                            <NavigationMenuLink asChild>
                                                <Link href="/">
                                                    Flowers for tea
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-heading px-2 py-1 text-2xl">By species</h3>
                                            <NavigationMenuLink asChild>
                                                <Link href="/">
                                                    Daisies
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="/">
                                                    Roses
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="/">
                                                    Chrysanthemums
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link className="text-muted-foreground italic" href="/">
                                                    More species...
                                                </Link>
                                            </NavigationMenuLink>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <span className="grow"></span>
                            <Button variant="ghost" className="rounded-full size-10 p-0">
                                <SearchIcon className="size-5" />
                            </Button>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="rounded-full size-10 p-0" hasIcon={false}>
                                    <ShoppingBasketIcon className="size-5" />
                                    <span>
                                        <Badge variant="secondary" className="absolute -bottom-1 -right-1 h-5 min-w-5 p-1 tabular-nums">
                                            0
                                        </Badge>
                                    </span>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex md:justify-end md:text-end gap-4 w-full">
                                        <div className="flex flex-col">
                                            <h3 className="font-heading px-2 py-1 text-2xl">Basket</h3>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="ml-2">
                                <NavigationMenuTrigger className="border rounded-full size-12 p-0" hasIcon={false}>
                                    <UserIcon className="size-5" />
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex md:justify-end md:text-end gap-4 w-full">
                                        <div className="px-2 text-sm">
                                            <p className="max-w-80">
                                                Sign up for an account and get extra features and exclusive discounts!
                                            </p>
                                            <p className="flex md:flex-row-reverse mt-4 gap-2">
                                                <Button variant="secondary" asChild>
                                                    <Link href="/login">
                                                        Log in
                                                    </Link>
                                                </Button>
                                                <Button asChild>
                                                    <Link href="/register">
                                                        Create an account
                                                    </Link>
                                                </Button>
                                            </p>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    </>;
}