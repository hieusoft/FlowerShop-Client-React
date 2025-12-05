"use client";

import { createContext } from "react";

export const ShipperContext = createContext({
    deliveries: [],
    updateDeliveryStatus: (id: string, status: string) => {},
    getDeliveryRoutes: (id: string) => []
});