"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { DataTable } from "@/components/blocks/dashboard/data-table"
import { BouquetEditor } from "@/components/blocks/dashboard/editors/bouquet-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ProductManager } from "@/lib/api/ProductService"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<object>[] = [
    {
        accessorKey: "name",
        header: "Name",
        size: 500,
        minSize: 500,
    },
    {
        accessorKey: "price",
        header: "Price",
        size: 100,
        minSize: 100,
    },
    {
        accessorKey: "subOccasionId.name",
        header: "Occasion",
        size: 200,
        minSize: 200,
    },
]

const managerInstance = new ProductManager();

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Bouquets"]}>
            <DataManager columns={columns} manager={managerInstance} editor={BouquetEditor} />
        </DashboardLayout>
    )
}