"use client";

import { ObjectState, useObjectState } from "@/hooks/use-object-state";
import AuthService from "@/lib/AuthService";
import { Occasion } from "@/models/occasion";
import React, { Context, createContext, useContext, useEffect } from "react";

const defaultValue = {
    user: null as User | null,
    userBusy: false,
}

export const GlobalContext = createContext(defaultValue) as unknown as Context<ObjectState<typeof defaultValue>>;

export function GlobalContextProvider(
    { children }: { 
        children: React.ReactNode 
    }
) {
    const objectState = useObjectState(defaultValue);

    console.log(objectState);

    return <GlobalContext value={objectState}>{ children }</GlobalContext>
}

export function useUser() {
    const context = useContext(GlobalContext);
    useEffect(() => {
        if (!context.user && !context.userBusy) {
            context.set.userBusy(true);
            AuthService.Profile().then(({ data }) => {
                context.set.userBusy(false);
                context.set.user(data);
            }).catch(() => {
                context.set.userBusy(false);
                context.set.user({});
            })
        }
    }, [])
    return {
        user: context.user,
        userBusy: context.userBusy

    }
}