"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "tailwindcss";
import { Signature } from "../../ui/signature";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "../../ui/navigation-menu";
import { Button } from "../../ui/button";
import { AccessibilityIcon, Flower2Icon, MenuIcon, MonitorIcon, MoonIcon, SearchIcon, Settings2Icon, ShoppingBasketIcon, SunIcon, UserIcon, XIcon } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Empty, EmptyContent, EmptyHeader } from "@/components/ui/empty";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function Header({}) {

    const [isScrolled, setIsScrolled] = useState(false);
    const [navValue, setNavValue] = useState("");

    const isMobile = useIsMobile();
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const { theme, setTheme } = useTheme()

    const orientation = isMobile ? "vertical" : "horizontal";

    function handleNavValueChange(target: string) {
        console.log("nav value = " + target)
        if (isMobile && isMobileExpanded) {
            setNavValue(target || navValue || "header-bouquets");
        } else {
            setNavValue(target);
        }
    }

    function handleMobileExpandedChange(target: boolean) {
        setIsMobileExpanded(target);
    }

    function handleDocumentScroll(event: Event) {
        console.log("scroll event fired");
        const scrollY = document.scrollingElement?.scrollTop ?? 0;
        console.log("scroll event fired", scrollY);
        setIsScrolled(scrollY > 0);
    }

    function handleMobileExpandedToggle() {
        setIsMobileExpanded(!isMobileExpanded);
    }

    useEffect(() => {
        window.addEventListener("scroll", handleDocumentScroll);

        return () => {
            window.removeEventListener("scroll", handleDocumentScroll);
        }
    }, [])

    useEffect(() => {
        if (!isMobile && isMobileExpanded) {
            setIsMobileExpanded(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile])

    useEffect(() => {
        setNavValue(isMobileExpanded ? "header-bouquets" : "");
    }, [isMobileExpanded])

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
                    {/* Mobile nav */}
                    <div className={cn(
                        "flex gap-2 ml-auto",
                        isMobile ? "" : "hidden"
                    )}>
                        <Button variant="ghost" className="bg-background border rounded-full size-12 p-0" onClick={handleMobileExpandedToggle}>
                            <MenuIcon className="size-5" />
                        </Button>
                    </div>
                    <NavigationMenu className={cn(
                        "max-w-none",
                        isMobile 
                            ? cn(
                                "fixed h-auto *:first:h-full right-0 top-0 bottom-0 justify-end",
                                isMobileExpanded ? "" : "pointer-events-none translate-x-full"
                            )
                            : "flex-1 ml-8 *:first:w-full transition-[margin,padding]"
                    )} orientation={orientation} value={navValue} onValueChange={handleNavValueChange} viewport="custom">
                        <NavigationMenuList className={cn(
                            "flex-wrap",
                            isMobile 
                                ? "h-full flex-col items-center bg-background border-l p-4 gap-2"
                                : ""
                        )}>
                            {/* Mobile nav */}
                            <div className={cn(
                                "flex gap-2 ml-auto",
                                isMobile ? "" : "hidden"
                            )}>
                                <Button variant="ghost" className="bg-background rounded-full size-12 p-0" onClick={handleMobileExpandedToggle}>
                                    <XIcon className="size-5" />
                                </Button>
                            </div>
                            <NavigationMenuItem value="header-bouquets">
                                <NavigationMenuTrigger className={isMobile ? "rounded-full size-10 p-0" : ""} hasIcon={!isMobile}>
                                    {isMobile ? <Flower2Icon className="size-5" /> : "Bouquets"}
                                </NavigationMenuTrigger>
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
                                <NavigationMenuTrigger className={isMobile ? "rounded-full size-10 p-0" : ""} hasIcon={!isMobile}>
                                    {isMobile ? <Flower2Icon className="size-5" /> : "Flowers"}
                                </NavigationMenuTrigger>
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
                            <Button variant="ghost" className="bg-background rounded-full size-10 p-0">
                                <SearchIcon className="size-5" />
                            </Button>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="rounded-full size-10 p-0" hasIcon={false}>
                                    <ShoppingBasketIcon className="size-5" />
                                    <span>
                                        <Badge variant="secondary" className="absolute -bottom-1 -right-1 h-5 min-w-5 p-1 tabular-nums">
                                            0
                                            {/** TODO implement basket / cart */}
                                        </Badge>
                                    </span>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex md:justify-end md:text-end gap-4 w-full">
                                        <div className="flex flex-col">
                                            {/** TODO implement basket / cart */}
                                            <Empty className="gap-2 max-h-none py-0 px-2 md:py-0 md:px-2 items-start *:text-start *:items-start md:items-end md:*:text-end md:*:items-end">
                                                <EmptyHeader className="font-heading text-2xl py-1">
                                                    Your basket is empty
                                                </EmptyHeader>
                                                <EmptyContent>
                                                    Things you add into your basket will be displayed here.
                                                </EmptyContent>
                                            </Empty>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="rounded-full size-10 p-0" hasIcon={false}>
                                    <Settings2Icon className="size-5" />
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="flex lg:justify-end lg:text-end">
                                    <div className="flex flex-col lg:items-end lg:text-end">
                                        <h3 className="font-heading tracking-tight px-2 py-1 text-2xl">Colors</h3>
                                        <ToggleGroup 
                                            className="lg:justify-end px-2 mt-2"
                                            type="single" variant="outline" value={theme} onValueChange={setTheme}
                                        >
                                            <ToggleGroupItem value="system">
                                                <MonitorIcon />
                                                Auto
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="light">
                                                <SunIcon />
                                                Light
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="dark">
                                                <MoonIcon />
                                                Dark
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem className={cn(isMobile ? "mt-2" : "ml-2")}>
                                <NavigationMenuTrigger className="border rounded-full size-12 p-0" hasIcon={false}>
                                    <UserIcon className="size-5" />
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="flex lg:justify-end lg:text-end gap-4 w-full">
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
                        <NavigationMenuViewport className={cn(
                            "transition-[margin] *:transition-all",
                            isMobile ? "" : (isScrolled ? "*:pb-8" : "border-t *:pt-4 -mt-2")
                        )}>
                        </NavigationMenuViewport>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    </>;
}