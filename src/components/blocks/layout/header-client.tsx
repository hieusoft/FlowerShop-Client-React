"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Signature } from "../../ui/signature";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "../../ui/navigation-menu";
import { Button } from "../../ui/button";
import { CalendarIcon, MenuIcon, MoonIcon, SearchIcon, Settings2Icon, ShoppingBasketIcon, SunIcon, UserIcon, XIcon } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Empty, EmptyContent, EmptyHeader } from "@/components/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HeaderSearch, HeaderSearchContent, HeaderSearchTrigger } from "./header-search";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";
import { MonitorIcon } from "lucide-react";
import { HeaderUser } from "./header-user";
import { CartItem } from "@/models/cart";
import { useParams, usePathname } from "next/navigation";

export function HeaderClient(
    { occasions } : { occasions: React.ReactNode }
) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [navValue, setNavValue] = useState("");
    const [cartQty, setCartQty] = useState(0);

    const pathname = usePathname();
    const params = useParams();

    const isMobile = useIsMobile();
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const { theme, setTheme } = useTheme();
    const orientation = isMobile ? "vertical" : "horizontal";

    function handleNavValueChange(target: string) {
        if (isMobile && isMobileExpanded) {
            setNavValue(target || navValue || "header-bouquets");
        } else {
            setNavValue(target);
        }
    }

    function handleMobileExpandedToggle() {
        setIsMobileExpanded(!isMobileExpanded);
    }

    function handleDocumentScroll() {
        const scrollY = document.scrollingElement?.scrollTop ?? 0;
        setIsScrolled(scrollY > 0);
    }

    // Scroll listener
    useEffect(() => {
        window.addEventListener("scroll", handleDocumentScroll);
        return () => window.removeEventListener("scroll", handleDocumentScroll);
    }, []);

    // Reset mobile menu if screen changes
    useEffect(() => {
        if (!isMobile && isMobileExpanded) {
            setIsMobileExpanded(false);
        }
        setNavValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile])

    useEffect(() => {
        setNavValue(isMobileExpanded ? "header-bouquets" : "");
    }, [isMobileExpanded]);

    useEffect(() => {
        const updateCartQty = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const totalQty = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
            setCartQty(totalQty);
        };

        updateCartQty();
        window.addEventListener("cartUpdated", updateCartQty);

        return () => window.removeEventListener("cartUpdated", updateCartQty);
    }, []);

    useEffect(() => {
        setIsMobileExpanded(false);
    }, [pathname, params])

    return (
        <header className="@container/header sticky top-0 h-24 z-1000">
            <div className={cn(
                "transition-all duration-300 border-b border-transparent bg-transparent",
                isScrolled ? "border-border bg-background" : ""
            )}>
                <HeaderSearch>
                    <div className={cn(
                        "container mx-auto flex items-center h-24 px-8 transition-all duration-300 relative",
                        isScrolled ? "h-16" : ""
                    )}>
                        <Link href="/">
                            <h1>
                                <Signature />
                            </h1>
                        </Link>
                        <div className={cn("flex gap-2 ml-auto", isMobile ? "" : "hidden")}>
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
                                <div className={cn("flex gap-2 ml-auto", isMobile ? "" : "hidden")}>
                                    <Button variant="ghost" className="bg-background rounded-full size-12 p-0" onClick={handleMobileExpandedToggle}>
                                        <XIcon className="size-5" />
                                    </Button>
                                </div>
                                <NavigationMenuItem value="header-bouquets">
                                    <NavigationMenuTrigger className={isMobile ? "rounded-full size-10 p-0" : ""} hasIcon={!isMobile}>
                                        {isMobile ? <CalendarIcon className="size-5" /> : "Occasions"}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>{occasions}</NavigationMenuContent>
                                </NavigationMenuItem>
                                <span className="grow"></span>
                                <HeaderSearchTrigger>
                                    <Button variant="ghost" className="bg-background rounded-full size-10 p-0">
                                        <SearchIcon className="size-5" />
                                    </Button>
                                </HeaderSearchTrigger>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="rounded-full size-10 p-0" hasIcon={false}>
                                        <ShoppingBasketIcon className="size-5" />
                                        {cartQty > 0 && (
                                            <Badge variant="secondary" className="absolute -bottom-1 -right-1 h-5 min-w-5 p-1 tabular-nums">
                                                {cartQty}
                                            </Badge>
                                        )}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="flex flex-col md:flex-row md:justify-end md:text-end gap-4 w-full">
                                            <div className="flex flex-col">
                                                {cartQty === 0 ? (
                                                    <Empty className="gap-2 max-h-none py-0 px-2 md:py-0 md:px-2 items-start *:text-start *:items-start md:items-end md:*:text-end md:*:items-end">
                                                        <EmptyHeader className="font-heading text-2xl py-1">
                                                            Your basket is empty
                                                        </EmptyHeader>
                                                        <EmptyContent>
                                                            Things you add into your basket will be displayed here.
                                                        </EmptyContent>
                                                    </Empty>
                                                ) : (
                                                    <p className="px-2 py-2">You have {cartQty} item(s) in your cart.</p>
                                                )}
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="rounded-full size-10 p-0" hasIcon={false}>
                                        <Settings2Icon className="size-5" />
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="flex flex-col md:flex-row md:justify-end md:text-end">
                                        <h2 className="font-heading px-2 pt-1 pb-4 text-3xl md:sr-only">Preferences</h2>
                                        <div className="flex flex-col md:items-end md:text-end">
                                            <h3 className="font-heading tracking-tight px-2 py-1 text-2xl">Colors</h3>
                                            <ToggleGroup className="lg:justify-end px-2 mt-2" type="single" variant="outline" value={theme} onValueChange={setTheme}>
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
                                <HeaderUser className={cn(isMobile ? "mt-2" : "ml-2")} />
                            </NavigationMenuList>
                            <NavigationMenuViewport className={cn(
                                "transition-[margin] *:transition-all",
                                isMobile ? "" : (isScrolled ? "*:pb-8" : "border-t *:pt-4 -mt-2")
                            )} />
                        </NavigationMenu>
                    </div>
                    <HeaderSearchContent />
                </HeaderSearch>
            </div>
        </header>
    );
}
