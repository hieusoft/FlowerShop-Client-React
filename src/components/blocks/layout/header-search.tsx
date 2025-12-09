"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ObjectState, useObjectState } from "@/hooks/use-object-state";
import { SearchIcon } from "lucide-react";
import { redirect, RedirectType, useParams, usePathname } from "next/navigation";
import React, { createContext, FormEvent, useContext, useEffect } from "react";

const searchDefaultState = {
    query: "",
    isOpen: false,
    isBusy: false,
}
const SearchContext = createContext(searchDefaultState) as unknown as React.Context<ObjectState<typeof searchDefaultState>>;

export function HeaderSearch(
    { children } : {
        children: React.ReactNode
    }
) {
    const searchState = useObjectState(searchDefaultState);
    const pathname = usePathname();
    const params = useParams();

    useEffect(() => {
        searchState.set.isOpen(false);
        setTimeout(() => {
            searchState.set.query("");
            searchState.set.isBusy(false);
        }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, params])
    
    return <SearchContext value={searchState}>
        <Dialog open={searchState.isOpen} onOpenChange={searchState.set.isOpen}>
            {children}
        </Dialog>
    </SearchContext>
}

export function HeaderSearchTrigger(
    { children } : {
        children: React.ReactNode
    }
) {
    return <DialogTrigger asChild>
        {children}
    </DialogTrigger>
}


export function HeaderSearchContent(
    // { } : { }
) {
    const searchState = useContext(SearchContext);

    function handleQueryChange(event: FormEvent<HTMLInputElement>) {
        searchState.set.query(event.currentTarget.value);
    }

    function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        searchState.set.isBusy(true);
        redirect(`/search?q=${searchState.query}`, RedirectType.push);
    }

    return <DialogContent showCloseButton={false}
        className="top-6 translate-y-0 rounded-[100dvw] p-2 sm:w-[max(50%,40em)] max-w-[calc(100%-3em)]!"
    >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <form className="flex" onSubmit={handleSearchSubmit}>
            <Input 
                placeholder="Search bouquets..."
                className="flex-1 border-none bg-transparent! rounded-[100dvw]"
                value={searchState.query} disabled={searchState.isBusy} onInput={handleQueryChange} />
            <Button 
                variant="secondary" size="icon-lg" 
                className="-m-0.5 ml-2 rounded-[100dvw]" 
                disabled={searchState.isBusy}
            >
                {searchState.isBusy ? <Spinner className="size-5" /> : <SearchIcon className="size-5" />}
            </Button>
        </form>
    </DialogContent>
}