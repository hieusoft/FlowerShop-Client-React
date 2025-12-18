"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { CouponEditor } from "@/components/blocks/dashboard/editors/coupon-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { AdminContext } from "@/components/providers/contexts/admin-context";
import { CouponManager } from "@/lib/api/CouponService";
import { Coupon } from "@/models/coupon";
import { ColumnDef } from "@tanstack/react-table"
import { useContext } from "react";


const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "code",
    header: "Code",
    size: 120,
  },
  {
    accessorKey: "discountType",
    header: "Type",
    size: 120,
  },
  {
    accessorKey: "discountValue",
    header: "Discount",
    size: 120,
    cell: ({ row }) => {
      const type = row.original.discountType
      const value = row.original.discountValue
      return type === "percent" ? `${value}%` : `${value.toLocaleString()} ₫`
    },
  },
  {
    accessorKey: "minPrice",
    header: "Min Price",
    size: 120,
    cell: ({ getValue }) =>
      Intl.NumberFormat("vi-VN").format(getValue<number>()) + " ₫",
  },
  {
    accessorKey: "maxUses",
    header: "Max Uses",
    size: 120,
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    size: 160,
    cell: ({ getValue }) =>
      new Date(getValue<string>()).toLocaleDateString(),
  },
  {
    accessorKey: "occasion",
    header: "Occasion",
    size: 160,
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


const managerInstance = new CouponManager();

export default function BouquetPage() {
    return (
        <DashboardLayout breadcrumb={["Management", "Content", "Coupon"]}>
            <DataManager columns={columns} manager={managerInstance} editor={CouponEditor} />
        </DashboardLayout>
    )
}