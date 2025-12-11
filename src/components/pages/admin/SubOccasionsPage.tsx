"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { SubOccasionEditor } from "@/components/blocks/dashboard/editors/suboccasion-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { SubOccasionManager } from "@/lib/api/SubOccasionService";
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<object>[] = [
    {
        accessorKey: "name",
        header: "Name",
        size: 300,
        minSize: 300,
    },
    {
        accessorKey: "occasionId.name",
        header: "Category",
        size: 300,
        minSize: 300,
    },
]

const managerInstance = new SubOccasionManager();

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Occasions"]}>
            <DataManager columns={columns} manager={managerInstance} editor={SubOccasionEditor} />
        </DashboardLayout>
    )
}