"use client";

import { useObjectState } from "@/hooks/use-object-state";
import { Occasion } from "@/models/occasion";
import React, { Context, createContext } from "react";

const defaultValue = {
    occasions: [] as Occasion[],
    cart: [],
}

export const UserContext = createContext(defaultValue);

export function UserContextProvider(
    { children }: { 
        children: React.ReactNode 
    }
) {
    let objectState = useObjectState(defaultValue);

    console.log(objectState);

    return <UserContext.Provider value={objectState}>{ children }</UserContext.Provider>
}