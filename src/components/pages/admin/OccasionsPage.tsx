"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { OccasionEditor } from "@/components/blocks/dashboard/editors/occasion-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { OccasionManager } from "@/lib/api/OccasionService";
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<object>[] = [
    {
        accessorKey: "name",
        header: "Name",
        size: 300,
        minSize: 300,
    },
]

const managerInstance = new OccasionManager();

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Occasion Categories"]}>
            <DataManager columns={columns} manager={managerInstance} editor={OccasionEditor} />
        </DashboardLayout>
    )
}