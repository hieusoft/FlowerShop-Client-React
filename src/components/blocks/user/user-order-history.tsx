import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderService from "@/lib/api/OrderService";
import { useUser } from "@/components/providers/contexts/global-context";
import { Order } from "@/models/order";
import { Pagination } from "@/components/ui/pagination";
import { ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react";

export default function UserOrderHistory() {
  const user = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [maxPages, setMaxPages] = useState(1);

  const handleDataLoad = useCallback(() => {
    if (user.user) {
      OrderService.list({ user_id: user.user.userId, page: currentPage, limit }).then(({ data }) => {
        setOrders(data.data);
        setMaxPages(data.totalPages);
      });
    }
  }, [user.user, currentPage, limit]);

  useEffect(() => {
    setOrders([]);
    handleDataLoad();
  }, [handleDataLoad]);

  useEffect(() => {
    document.scrollingElement!.scrollTop = 0;
  }, [currentPage]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Đơn hàng của bạn</h1>
      {orders.map((order) => (
        <Card key={order.order_id} className="border">
          <CardHeader>
            <CardTitle>Mã đơn: {order.order_code}</CardTitle>
            <CardDescription>{order.created_at}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <p>
                Trạng thái: <span className={`font-semibold ${order.status === "Paid" ? "text-green-600" : order.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}>{order.status}</span>
              </p>
              <p>Tổng tiền: {order.total_price.toLocaleString("vi-VN")} VND</p>
            </div>
            <Button variant="outline">Xem chi tiết</Button>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-end gap-2 items-center">
        <span className="block px-2 ml-3 lining-nums">
            Page {currentPage} of {maxPages}
        </span>
        <Button variant="outline" size="icon" 
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(1)}>
            <ChevronsLeftIcon />
            <span className="sr-only">First</span>
        </Button>
        <Button variant="outline" size="icon"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}>
            <ChevronLeftIcon />
            <span className="sr-only">Previous</span>
        </Button>
        <Button variant="outline" size="icon"
            disabled={currentPage >= maxPages}
            onClick={() => setCurrentPage(currentPage + 1)}>
            <ChevronRightIcon />
            <span className="sr-only">Next</span>
        </Button>
        <Button variant="outline" size="icon"
            disabled={currentPage >= maxPages}
            onClick={() => setCurrentPage(maxPages)}>
            <ChevronsRightIcon />
            <span className="sr-only">Last</span>
        </Button>
      </div>
    </div>
  );
}
