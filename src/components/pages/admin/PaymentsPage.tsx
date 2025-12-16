"use client";

import { DataManager } from "@/components/blocks/dashboard/data-manager";
import { DashboardLayout } from "@/components/layouts/dashboard";
import { ColumnDef } from "@tanstack/react-table";

import { Payment } from "@/models/payment";
import { PaymentEditor } from "@/components/blocks/dashboard/editors/payment-editor";
import { PaymentManager } from "@/lib/api/PaymentService";

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "payment_id",
    header: "ID",
    size: 80,
    minSize: 80,
  },
  {
    accessorKey: "order_id",
    header: "Order ID",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "provider",
    header: "Provider",
    size: 150,
    minSize: 150,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "currency",
    header: "Currency",
    size: 100,
    minSize: 100,
  },
    {
    accessorKey: "converted_amount",
    header: "ConvertedAmount",
    size: 100,
    minSize: 100,
  },
  
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    minSize: 120,
  },
  {
    accessorKey: "expires_at",
    header: "Expires At",
    size: 180,
    minSize: 180,
  },
];

const managerInstance = new PaymentManager();

export default function PaymentPage() {
  return (
    <DashboardLayout breadcrumb={["Management", "Content", "Payments"]}>
      <DataManager
        columns={columns}
        manager={managerInstance}
        editor={PaymentEditor}
      />
    </DashboardLayout>
  );
}
