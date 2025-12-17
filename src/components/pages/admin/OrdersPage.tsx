"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager"
import { OrderEditor } from "@/components/blocks/dashboard/editors/order-editor";
import { DashboardLayout } from "@/components/layouts/dashboard"
import { OrderManager } from "@/lib/api/OrderService";
import { Order } from "@/models/order";
import { ColumnDef } from "@tanstack/react-table"


const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_id",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "order_code",
    header: "Order Code",
    size: 160,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    size: 100,
  },
  {
    accessorKey: "total_price",
    header: "Total Price",
    size: 120,
  },
  {
    accessorKey: "discount",
    header: "Discount",
    size: 100,
  },
  {
    accessorKey: "coupon_code",
    header: "Coupon",
    size: 120,
  },
  {
    accessorKey: "vat_amount",
    header: "VAT",
    size: 100,
  },
  {
    accessorKey: "shipping_fee",
    header: "Shipping Fee",
    size: 120,
  },
  {
    accessorKey: "message",
    header: "Message",
    size: 200,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 200,
  },
  {
    accessorKey: "delivery_date",
    header: "Delivery Date",
    size: 160,
    cell: ({ row }) =>
      new Date(row.original.delivery_date).toLocaleDateString(),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 160,
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    size: 160,
    cell: ({ row }) =>
      new Date(row.original.updated_at).toLocaleString(),
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