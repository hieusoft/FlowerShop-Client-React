"use client";

import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner";
import UserService from "@/lib/api/UserService";
import { redirect, usePathname } from "next/navigation";
import { User } from "@/models/user";

const protectedRoutes = {
    "/admin": "Admin"
};

export function AdminVerifier(
    {children} : {
        children: React.ReactNode
    }
) {
    const [verified, setVerified] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        UserService.profile().then(({data}) => {
            for (const route in protectedRoutes) {
                if (pathname.startsWith(route) && !(data as User).roles.includes(protectedRoutes[route])) {
                    redirect("/");
                    return;
                }
            }
            setVerified(true);
        }).catch(() => {
            redirect("/")
        })
    }, [])

    return verified ? children : (
        <div className="fixed inset-0 flex items-center justify-center">
            <Spinner />
        </div>
    )
}