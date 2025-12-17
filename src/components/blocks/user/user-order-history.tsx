"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderService from "@/lib/api/OrderService";
import { Order } from "@/models/order";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await OrderService.list({
          status,
          order_code: "",
          pages: page,
          limit,
        });
        setOrders(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status, page]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-600";
      case "Pending":
        return "text-yellow-600";
      case "Cancelled":
        return "text-red-600";
      case "Shipping":
        return "text-blue-600";
      case "Completed":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };



  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your order history</CardDescription>
        </CardHeader>
        <CardContent>
          <NativeSelect
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
            }}
            className="mb-4 w-48"
          >
            <NativeSelectOption value="">All Statuses</NativeSelectOption>
            <NativeSelectOption value="Pending">Pending</NativeSelectOption>
            <NativeSelectOption value="Paid">Paid</NativeSelectOption>
            <NativeSelectOption value="Cancelled">Cancelled</NativeSelectOption>
            <NativeSelectOption value="Shipping">Shipping</NativeSelectOption>
            <NativeSelectOption value="Completed">Completed</NativeSelectOption>
          </NativeSelect>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <Skeleton/>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              You have no orders for this status.
            </div>
          ) : (
            <>
              {orders.map((order) => (
                <Card key={order.order_id} className="mb-4">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Order Code: {order.order_code}
                        </CardTitle>
                        <CardDescription>
                          {new Date(order.created_at).toLocaleString("en-US")}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">Status: </span>
                          <span className={`font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold">
                        Total: {Number(order.total_price).toLocaleString("en-US")} USD
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => alert(`View details of order ${order.order_code}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) {
                           setPage(page - 1);
                          }
                        }}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNumber = idx + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNumber);
                            }}
                            isActive={pageNumber === page}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) {
                           setPage(page+1);
                          }
                        }}
                        className={
                          page === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}