"use client";

import { useEffect, useState } from "react";
import {
  XCircle,
  AlertTriangle,
  Download,
  Share2,
  Home,
  ShoppingBag,
  Clock,
  Mail,
  Phone,
  ArrowRight,
  Truck,
  RefreshCw,
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

export default function PaymentFailedPage() {
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

    // Chỉ load order nếu có ID, không kiểm tra status
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
  }, [orderId, router]);

  useEffect(() => {
    const createConfetti = () => {
      const colors = ["#ef4444"," #dc2626", "#f87171", "#fca5a5", "#fecaca"];
      const confettiCount = 30;

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

    return () => {
      clearTimeout(t1);
    };
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment Processing Issue",
          text: "I encountered an issue with my payment. Need assistance.",
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
      "        PAYMENT FAILED",
      "==============================",
      `Order ID: #${order.id}`,
      `Date: ${new Date(order.created_at).toLocaleDateString()}`,
      `Status: PAYMENT FAILED`,
      "------------------------------",
      "ITEMS IN CART:",
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
      "Payment was not completed. Please try again or contact support.",
    ];

    const content = lines.join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `payment-failed-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const handleRetryPayment = () => {
    // Logic để thử lại thanh toán
    // Có thể redirect đến trang thanh toán với orderId
    router.push(`/checkout/${orderId}`);
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
    <div className="min-h-screen bg-gradient-to-b from-red-50/50 via-white to-orange-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse opacity-75"></div>
            <div className="relative">
              <div className="relative h-32 w-32 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg"></div>
                <XCircle className="absolute inset-0 m-auto h-20 w-20 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Payment Processing Issue
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We encountered an issue while processing your payment for order{" "}
            <span className="font-semibold text-red-600">
              #{order.order_code}
            </span>
            . Please try again or contact support.
          </p>

          <Badge className="px-6 py-3 text-lg bg-red-100 text-red-800 border-2 border-red-200">
            <XCircle className="h-5 w-5 mr-2" />
            Payment Failed
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-2xl">
                  <ShoppingBag className="h-6 w-6 mr-3 text-red-600" />
                  Order Summary
                </CardTitle>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  Payment Failed
                </Badge>
              </div>
              <CardDescription>
                Order attempted on {new Date(order.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Order Progress
                  </span>
                  <span className="text-sm text-gray-500">Step 2 of 3</span>
                </div>
                <Progress value={66} className="h-2" />
                <p className="text-sm text-red-500 mt-2">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Payment step incomplete
                </p>
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

              <div className="bg-gradient-to-r from-gray-50 to-red-50 p-6 rounded-xl border">
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
                    <span className="text-red-600">${order.total_price}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-yellow-800 mb-2">
                      Payment not completed
                    </p>
                    <p className="text-sm text-yellow-700">
                      Your items are reserved for 30 minutes. Complete your
                      payment to secure your order.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={handleRetryPayment}
                  className="w-full h-12 bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Retry Payment
                </Button>

                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Order Details
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full h-12"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share for Support
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
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>support@example.com</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>1-800-HELP-NOW</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
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