"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { OrderEditor } from "@/components/blocks/dashboard/editors/order-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { OrderManager } from "@/lib/api/OrderService";
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<object>[] = [
    {
        accessorKey: "order_code",
        header: "Order code",
        size: 300,
        minSize: 300,
    },
    {
        accessorKey: "status",
        header: "Status",
        size: 300,
        minSize: 300,
    },
    {
        accessorKey: "total_price",
        header: "Total price",
        size: 300,
        minSize: 300,
    },
]

const managerInstance = new OrderManager();

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Order"]}>
            <DataManager columns={columns} manager={managerInstance} editor={OrderEditor} />
        </DashboardLayout>
    )
}