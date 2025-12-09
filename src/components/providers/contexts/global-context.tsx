"use client";

import { useObjectState } from "@/hooks/use-object-state";
import { Occasion } from "@/models/occasion";
import React, { Context, createContext } from "react";

const defaultValue = {
    user: {} as unknown
}

export const GlobalContext = createContext(defaultValue);

export function GlobalContextProvider(
    { children }: { 
        children: React.ReactNode 
    }
) {
    let objectState = useObjectState(defaultValue);

    console.log(objectState);

    return <GlobalContext.Provider value={objectState}>{ children }</GlobalContext.Provider>
}