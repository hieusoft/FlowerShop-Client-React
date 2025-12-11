"use client";

import SubOccasionsPage from "@/components/pages/admin/SubOccasionsPage";
import { defaultObjectState, useObjectState } from "@/hooks/use-object-state";
import { Occasion, SubOccasion } from "@/models/occasion";
import React, { Context, createContext } from "react";

const defaultValue = {
    subOccasions: null as SubOccasion[] | null,
    occasions: null as Occasion[] | null
}

export const AdminContext = createContext(defaultObjectState(defaultValue));

export function AdminContextProvider(
    { children }: { 
        children: React.ReactNode 
    }
) {
    let objectState = useObjectState(defaultValue);

    console.log(objectState);

    return <AdminContext.Provider value={objectState}>{ children }</AdminContext.Provider>
}