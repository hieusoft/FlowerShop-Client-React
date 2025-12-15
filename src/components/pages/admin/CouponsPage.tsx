"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { CouponEditor } from "@/components/blocks/dashboard/editors/coupon-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { AdminContext } from "@/components/providers/contexts/admin-context";
import { CouponManager } from "@/lib/api/CouponService";
import { ColumnDef } from "@tanstack/react-table"
import { useContext } from "react";

const columns: ColumnDef<object>[] = [
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "discount_value",
        header: "Discount",
    },
    {
        accessorKey: "min_price",
        header: "Min price",
    },
    {
        accessorKey: "max_uses",
        header: "Uses left",
    },
]

const managerInstance = new CouponManager();

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Coupon"]}>
            <DataManager columns={columns} manager={managerInstance} editor={CouponEditor} />
        </DashboardLayout>
    )
}