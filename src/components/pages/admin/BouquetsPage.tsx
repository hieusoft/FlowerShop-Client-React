import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { DataTable } from "@/components/blocks/dashboard/data-table"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<object>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "quantitySold",
        header: "Sold",
    },
    {
        accessorKey: "quantityInStock",
        header: "In stock",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "occasion",
        header: "Occasion",
    },
]

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Bouquets"]}>
            <DataManager columns={columns} />
        </DashboardLayout>
    )
}