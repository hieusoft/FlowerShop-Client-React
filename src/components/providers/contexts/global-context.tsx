"use client";

import { Context, createContext } from "react";

export const GlobalContext = createContext({
    user: {} as unknown
});