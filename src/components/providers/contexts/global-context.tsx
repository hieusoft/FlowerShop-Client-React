"use client";

import { ObjectState, useObjectState } from "@/hooks/use-object-state";
import { getUserClaims } from "@/lib/api";
import AuthService from "@/lib/api/AuthService";
import { Occasion } from "@/models/occasion";
import { User } from "@/models/user";
import React, { Context, createContext, useContext, useEffect, useState } from "react";

const defaultValue = {
    user: undefined as User | undefined | null,
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
        if (context.user === undefined && !context.userBusy) {
            context.set.userBusy(true);
            AuthService.profile().then(({ data }) => {
                context.set.userBusy(false);
                context.set.user(data);
            }).catch(() => {
                context.set.userBusy(false);
                context.set.user(null);
            })
        }
    }, [])

    return {
        user: context.user,
        userBusy: context.userBusy
    }
}