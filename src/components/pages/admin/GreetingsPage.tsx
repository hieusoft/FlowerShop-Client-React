"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { GreetingEditor } from "@/components/blocks/dashboard/editors/greeting-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { AdminContext } from "@/components/providers/contexts/admin-context";
import { GreetingManager } from "@/lib/api/GreetingService";
import { ColumnDef } from "@tanstack/react-table"
import { useContext } from "react";

const columns: ColumnDef<object>[] = [
    {
        accessorKey: "text",
        header: "Text",
        cell: ({ row }) => (
            <span className="max-w-100 line-clamp-1">{row.getValue("text")}</span>
        ),
        size: 300,
        minSize: 300,
    },
    {
        accessorKey: "subOccasionId",
        header: "Occasion",
        cell: function Cell ({ row }) {
            const context = useContext(AdminContext);
            const occasionId = row.getValue("subOccasionId") as string;
            return context.subOccasions?.find(x => x.id == occasionId)?.name
        },
        size: 300,
        minSize: 300,
    },
]

const managerInstance = new GreetingManager();

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Greeting"]}>
            <DataManager columns={columns} manager={managerInstance} editor={GreetingEditor} />
        </DashboardLayout>
    )
}