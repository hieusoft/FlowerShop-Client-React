import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";

export function HeaderSearchTrigger(
    { children } : {
        children: React.ReactNode
    }
) {
    return <PopoverTrigger asChild>
        {children}
    </PopoverTrigger>
}

export function HeaderSearch(
    { children } : {
        children: React.ReactNode
    }
) {
    return <Popover>
        {children}
    </Popover>
}

export function HeaderSearchContent(
    { } : {

    }
) {
    return <PopoverContent 
        className="fixed top-4 left-4 right-4 w-full origin-top [*:has(>&)]:translate-0!"
    >
        Search model
    </PopoverContent>
}