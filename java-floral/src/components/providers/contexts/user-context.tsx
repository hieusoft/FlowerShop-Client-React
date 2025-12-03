"use client";

import { Context, createContext } from "react";

export const UserContext = createContext({
    cart: [] as unknown[]
});