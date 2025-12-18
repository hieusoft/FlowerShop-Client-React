"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Download,
  Share2,
  Home,
  ShoppingBag,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  Truck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import OrderService from "@/lib/api/OrderService";
import ProductService from "@/lib/api/ProductService";

export default function ThankYouPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = params.order_id as string | undefined;
  const status = searchParams.get("status");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.replace("/");
      return;
    }

    if (status && status !== "SUCCESS") {
      router.replace("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await OrderService.getById(orderId);
        const orderData = res.data;

        const itemsWithProduct = await Promise.all(
          (orderData.items || []).map(async (item: any) => {
            const productRes = await ProductService.fromId(item.bouquet_id);
            return { ...item, product: productRes.data };
          })
        );

        setOrder({ ...orderData, items: itemsWithProduct });
      } catch (err) {
        console.error("Fetch order failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, status, router]);

  useEffect(() => {
    const createConfetti = () => {
      const colors = ["#10b981", "#34d399", "#22d3ee", "#60a5fa", "#a78bfa"];
      const confettiCount = 50;

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.className = "absolute w-3 h-3 rounded-full";
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = "-10px";
        confetti.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(confetti);

        const animation = confetti.animate(
          [
            { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
            {
              transform: `translate(${(Math.random() - 0.5) * 200}px, ${
                window.innerHeight
              }px) rotate(${Math.random() * 360}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: 2000 + Math.random() * 2000,
            easing: "cubic-bezier(0.215, 0.610, 0.355, 1)",
          }
        );

        animation.onfinish = () => confetti.remove();
      }
    };

    createConfetti();
    const t1 = setTimeout(createConfetti, 300);
    const t2 = setTimeout(createConfetti, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Purchase Successful!",
          text: "I just completed my purchase successfully!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!order) return;

    const lines = [
      "==============================",
      "        ORDER INVOICE",
      "==============================",
      `Order ID: #${order.id}`,
      `Date: ${new Date(order.created_at).toLocaleDateString()}`,
      `Status: PAID`,
      "------------------------------",
      "ITEMS:",
      ...order.items.map(
        (item: any, index: number) =>
          `${index + 1}. ${item.product.name}  x${item.quantity}  -  $${
            item.price
          }`
      ),
      "------------------------------",
      `Subtotal: $${order.total_price - order.shipping_fee - order.vat_amount}`,
      `Shipping: $${order.shipping_fee}`,
      `VAT: $${order.vat_amount}`,
      "------------------------------",
      `TOTAL: $${order.total_price}`,
      "==============================",
      "Thank you for your purchase ❤️",
    ];

    const content = lines.join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !order) return null;
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-blue-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-75"></div>
            <div className="relative">
              <div className="relative h-32 w-32 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
                <CheckCircle className="absolute inset-0 m-auto h-20 w-20 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your order{" "}
            <span className="font-semibold text-green-600">
              #{order.order_code}
            </span>{" "}
            has been confirmed and is being processed.
          </p>

          <Badge className="px-6 py-3 text-lg bg-green-100 text-green-800 border-2 border-green-200">
            <CheckCircle className="h-5 w-5 mr-2" />
            Payment Successful
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-2xl">
                  <ShoppingBag className="h-6 w-6 mr-3 text-green-600" />
                  Order Summary
                </CardTitle>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Completed
                </Badge>
              </div>
              <CardDescription>Order placed on {new Date(order.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Order Progress
                  </span>
                  <span className="text-sm text-gray-500">Step 3 of 3</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="space-y-3 mb-8">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id || item.order_item_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`http://localhost:3000/api${item.product.images?.[0]}`}
                        className="w-16 h-16 rounded-lg object-cover"
                        alt={item.product.name}
                      />

                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">${item.price}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl border">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      $
                      {order.total_price -
                        order.shipping_fee -
                        order.vat_amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${order.shipping_fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (VAT 8%)</span>
                    <span>${order.vat_amount}</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600">${order.total_price}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <p>
                    Estimated delivery:{" "}
                    <strong>
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={handleDownload}
                  className="w-full h-12 bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Receipt
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Order
                </Button>

                <Button
                  onClick={() => router.push("/")}
                  variant="ghost"
                  className="w-full h-12"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Back to Home
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Continue Shopping
                </h3>
                <Button
                  onClick={() => router.push("/products")}
                  variant="outline"
                  className="w-full"
                >
                  Browse More Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
