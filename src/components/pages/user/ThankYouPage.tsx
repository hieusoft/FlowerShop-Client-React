"use client";

import { useEffect,useState } from "react";
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
import { useRouter } from "next/navigation";
import { useSearchParams, useParams } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const params = useParams();

  const searchParams = useSearchParams();

  const orderId = params.orderId as string;

  const status = searchParams.get("status");

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
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

    const timer1 = setTimeout(createConfetti, 300);
    const timer2 = setTimeout(createConfetti, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
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
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const orderId1 = `ORD-${Date.now().toString().slice(-8)}`;
    const invoiceContent = `
INVOICE #${orderId1}
============================
Date: ${new Date().toLocaleDateString()}
Status: PAID
-------------------------
ITEMS:
• Premium Widget: $49.99
• Extended Warranty: $9.99
• Shipping: $5.99
-------------------------
SUBTOTAL: $59.98
SHIPPING: $5.99
-------------------------
TOTAL: $65.97
============================
Thank you for your purchase!
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-1.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBackToHome = () => {
    router.push("/");
  };

//   const orderId1 = `ORD-${Date.now().toString().slice(-8)}`;
  const orderDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-blue-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
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
            <span className="font-semibold text-green-600">#{orderId}</span> has
            been confirmed and is being processed.
          </p>

          <Badge className="px-6 py-3 text-lg bg-green-100 text-green-800 border-2 border-green-200 hover:bg-green-200 transition-colors">
            <CheckCircle className="h-5 w-5 mr-2" />
            Payment Successful
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Card */}
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
              <CardDescription>Order placed on {orderDate}</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Order Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Order Progress
                  </span>
                  <span className="text-sm text-gray-500">Step 3 of 3</span>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Ordered</span>
                  <span>Confirmed</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-lg">Order Details</h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Premium Widget",
                      description: "Advanced widget with premium features",
                      price: "$49.99",
                    },
                    {
                      name: "Extended Warranty",
                      description: "Additional 3-year coverage",
                      price: "$9.99",
                    },
                    {
                      name: "Express Shipping",
                      description: "2-3 business days",
                      price: "$5.99",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <p className="font-semibold">{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Section */}
              <div className="bg-gradient-to-r from-gray-50 to-green-50 p-6 rounded-xl border">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">$59.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$5.99</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600">$65.97</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Estimated Delivery
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Your order will arrive by{" "}
                      {new Date(
                        Date.now() + 5 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What&apos;s Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Confirmation Email</h4>
                    <p className="text-sm text-gray-600">
                      Check your inbox for order details
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Processing</h4>
                    <p className="text-sm text-gray-600">
                      Your items are being prepared
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Support</h4>
                    <p className="text-sm text-gray-600">
                      Contact us if you need help
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
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
                  onClick={handleBackToHome}
                  variant="ghost"
                  className="w-full h-12"
                >
                  <Home className="h-5 w-5 mr-2" />
                  Back to Home
                </Button>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
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

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-gray-600">
          <p className="mb-2">Thank you for shopping with us! ❤️</p>
          <p className="text-sm">
            You will receive shipping updates via email.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <button className="text-blue-600 hover:text-blue-800">
              Track Order
            </button>
            <button className="text-blue-600 hover:text-blue-800">
              Order History
            </button>
            <button className="text-blue-600 hover:text-blue-800">
              Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
