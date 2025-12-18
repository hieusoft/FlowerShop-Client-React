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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import OrderItemService from "@/lib/api/OrderItemService";

export default function UserOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const fetchGetOrderItem = async (order: Order) => {
    const res = await OrderItemService.fromOrder(order.order_id);
    setOrderItems(res.data);
  }

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
    fetchGetOrderItem(order)
  };

  return (
    <div >
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your order history</CardDescription>
        </CardHeader>

        <CardContent>
          <NativeSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            <div className="py-8">
              <Skeleton className="h-24" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
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
                      <div>
                        <span className="font-semibold">{order.status}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold">
                        Total:{" "}
                        {Number(order.total_price).toLocaleString("en-US")} USD
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(order)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                  className="
                    max-w-6xl w-full
                    max-h-[90vh]
                    flex flex-col
                  "
                >
                  {selectedOrder && (
                    <>
                      <DialogHeader className="shrink-0">
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                          Order Code: {selectedOrder.order_code}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto space-y-6 pr-2">

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm">Order Date</p>
                            <p>
                              {new Date(
                                selectedOrder.created_at
                              ).toLocaleString("en-US")}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm">Status</p>
                            <Badge variant="secondary">
                              {selectedOrder.status}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-sm">Delivery Date</p>
                            <p>
                              {new Date(
                                selectedOrder.delivery_date
                              ).toLocaleString("en-US")}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm">Order</p>
                            <p>#{selectedOrder.order_code}</p>
                          </div>
                        </div>


                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">Order Items</h4>
                            <Badge variant="outline">
                              {orderItems.length} items
                            </Badge>
                          </div>

                          <div className="border rounded-lg">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead className="text-center">Quantity</TableHead>
                                  <TableHead className="text-right">Price</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {orderItems.map((item) => (
                                  <TableRow key={item.order_item_id}>
                                    <TableCell>
                                      <p>{item.bouquet_name}</p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge variant="secondary">
                                        {item.quantity}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      ${Number(item.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      $
                                      {Number(
                                        item.price * item.quantity
                                      ).toFixed(2)}
                                    </TableCell>
                                  </TableRow>
                                ))}

                                {orderItems.length === 0 && (
                                  <TableRow>
                                    <TableCell
                                      colSpan={4}
                                      className="text-center py-8"
                                    >
                                      No items found
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        <Card>
                          <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>
                                {Number(
                                  selectedOrder.total_price -
                                  selectedOrder.shipping_fee -
                                  selectedOrder.vat_amount +
                                  selectedOrder.discount
                                ).toLocaleString("en-US")} USD
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>VAT</span>
                              <span>
                                {Number(
                                  selectedOrder.vat_amount
                                ).toLocaleString("en-US")} USD
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>Shipping fee</span>
                              <span>
                                {Number(
                                  selectedOrder.shipping_fee
                                ).toLocaleString("en-US")} USD
                              </span>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-bold text-lg">
                              <span>Total</span>
                              <span>
                                {Number(
                                  selectedOrder.total_price
                                ).toLocaleString("en-US")} USD
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>


              {totalPages > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                      />
                    </PaginationItem>

                    {(() => {
                      const pages: (number | "dots")[] = [];

                      const addPage = (p: number | "dots") => {
                        if (!pages.includes(p)) pages.push(p);
                      };

                      addPage(1);

                      if (page > 3) addPage("dots");

                      for (let p = page - 1; p <= page + 1; p++) {
                        if (p > 1 && p < totalPages) addPage(p);
                      }

                      if (page < totalPages - 2) addPage("dots");

                      if (totalPages > 1) addPage(totalPages);

                      return pages.map((p, idx) =>
                        p === "dots" ? (
                          <PaginationItem key={`dots-${idx}`}>
                            <span className="px-3 text-muted-foreground">...</span>
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(p);
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      );
                    })()}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
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
