"use client";

import { removeAccessToken } from "@/lib/api";
import UserService from "@/lib/api/UserService";
import { Slot } from "@radix-ui/react-slot";
import { ReactNode } from "react";

export function UserLogOutButton({children}: { children: ReactNode }) {

    function handleLogout() {
        UserService.logout().then(() => {
            removeAccessToken();
            document.location.reload();
        })
    }
 
    return <Slot onClick={handleLogout}>
        {children}
    </Slot>
}