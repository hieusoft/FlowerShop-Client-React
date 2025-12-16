import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Order {
  id: number;
  code: string;
  status: "Pending" | "Paid" | "Cancelled";
  total: number;
  created_at: string;
}

const orders: Order[] = [
  { id: 1, code: "ORD001", status: "Paid", total: 1200000, created_at: "2025-12-01" },
  { id: 2, code: "ORD002", status: "Pending", total: 850000, created_at: "2025-12-05" },
  { id: 3, code: "ORD003", status: "Cancelled", total: 400000, created_at: "2025-12-08" },
];

export default function UserOrderHistory() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Đơn hàng của bạn</h1>
      {orders.map((order) => (
        <Card key={order.id} className="border">
          <CardHeader>
            <CardTitle>Mã đơn: {order.code}</CardTitle>
            <CardDescription>{order.created_at}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <p>Trạng thái: <span className={`font-semibold ${order.status === "Paid" ? "text-green-600" : order.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{order.status}</span></p>
              <p>Tổng tiền: {order.total.toLocaleString("vi-VN")} VND</p>
            </div>
            <Button variant="outline">Xem chi tiết</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
