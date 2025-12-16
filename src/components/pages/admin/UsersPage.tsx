"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UserManager } from "@/lib/api/UserService";
import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/models/user";
import { UserEditor } from "@/components/blocks/dashboard/editors/user-editor";

const columns: ColumnDef<User>[] = [

    {
        accessorKey: "fullName",
        header: "Full Name",
        size: 200,
        minSize: 200,
    },
    {
        accessorKey: "userName",
        header: "User Name",
        size: 200,
        minSize: 200,
    },
    {
        accessorKey: "email",
        header: "Email",
        size: 250,
        minSize: 250,
    },
    {
        accessorKey: "emailVerified",
        header: "EmailVerified",
        size: 200,
        minSize: 200,
    },
    {
        accessorKey: "roles",
        header: "Roles",
        size: 80,
        minSize: 80,
    },
]

const managerInstance = new UserManager();

export default function UserPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Users"]}>
            <DataManager columns={columns} manager={managerInstance} editor={UserEditor} />
        </DashboardLayout>
    )
}