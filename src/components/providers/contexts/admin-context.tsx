"use client";

import { useObjectState } from "@/hooks/use-object-state";
import { Occasion } from "@/models/occasion";
import React, { Context, createContext } from "react";

const defaultValue = {
    cart: [],
}

export const AdminContext = createContext(defaultValue);

export function AdminContextProvider(
    { children }: { 
        children: React.ReactNode 
    }
) {
    let objectState = useObjectState(defaultValue);

    console.log(objectState);

    return <AdminContext.Provider value={objectState}>{ children }</AdminContext.Provider>
}