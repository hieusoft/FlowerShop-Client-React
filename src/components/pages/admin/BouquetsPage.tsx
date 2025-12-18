"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { DataTable } from "@/components/blocks/dashboard/data-table"
import { BouquetEditor } from "@/components/blocks/dashboard/editors/bouquet-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ProductManager } from "@/lib/api/ProductService"
import { Bouquet } from "@/models/bouquet";
import { ColumnDef } from "@tanstack/react-table"
const IMAGE_BASE_URL = "http://54.254.156.167:8080"
const columns: ColumnDef<Bouquet>[] = [

    {
        accessorKey: "name",
        header: "Name",
        size: 300,
    },
    {
        accessorKey: "description",
        header: "Description",
        size: 400,
        cell: ({ getValue }) => {
            const value = getValue<string>()
            return value?.length > 80 ? value.slice(0, 80) + "…" : value
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        size: 120,
        cell: ({ getValue }) =>
            Intl.NumberFormat("vi-VN").format(getValue<number>()) + " ₫",
    },
    {
        accessorKey: "subOccasionId.name",
        header: "Sub Occasion",
        size: 200,
    },
    {
        accessorKey: "images",
        header: "Images",
        size: 120,
        cell: ({ getValue }) => {
            const images = getValue<any[]>()

            if (!images || images.length === 0) return "—"

            const first = images[0]
            let src = ""

            if (typeof first === "string") {
                src = `${IMAGE_BASE_URL}${first}`
            } else if ("url" in first) {
                src = `${IMAGE_BASE_URL}${first.url}`
            } else if ("base64" in first) {
                src = first.base64.startsWith("data:")
                    ? first.base64
                    : `data:image/jpeg;base64,${first.base64}`
            }

            return (
                <div className="flex items-center gap-2">
                    <img
                        src={src}
                        alt="bouquet"
                        className="h-10 w-10 rounded-md object-cover border"
                        loading="lazy"
                    />
                    {images.length > 1 && (
                        <span className="text-xs text-muted-foreground">
                            +{images.length - 1}
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        size: 160,
        cell: ({ getValue }) =>
            new Date(getValue<string>()).toLocaleString(),
    },
    {
        accessorKey: "updated_at",
        header: "Updated At",
        size: 160,
        cell: ({ getValue }) =>
            new Date(getValue<string>()).toLocaleString(),
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