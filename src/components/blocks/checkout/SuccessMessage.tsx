"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { CheckoutFormData } from "../../../models/checkout";

interface SuccessMessageProps {
  orderNumber: string;
  formData: CheckoutFormData;
}

export default function SuccessMessage({
  orderNumber,
  formData,
}: SuccessMessageProps) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateTotal = () => {
    const subtotal = 1790000; // Mock subtotal
    const shippingFee = formData.shippingMethod === "express" ? 50000 : 30000;
    return subtotal + shippingFee;
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
          <CardDescription>
            Thank you for your order. We will contact you shortly to confirm the
            details.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Your Order Number</p>
            <p className="text-2xl font-bold text-primary">{orderNumber}</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We have sent your order confirmation to your email address. Please
              check your inbox and spam folder.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{formData.fullName}</p>
                <p className="text-sm text-gray-600">{formData.phone}</p>
                <p className="text-sm text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {formData.address}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {formData.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : formData.paymentMethod === "bank"
                    ? "Bank Transfer"
                    : "Credit / Debit Card"}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Total Payment: {formatCurrency(calculateTotal())}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Delivery Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {formData.shippingMethod === "express"
                    ? "Express Delivery"
                    : "Standard Delivery"}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.shippingMethod === "express"
                    ? "1–2 business days"
                    : "3–5 business days"}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={() => window.print()}>
              Print Invoice
            </Button>
            <Button onClick={() => router.push("/orders")}>
              Track Your Order
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            You can track your order status in{" "}
            <a
              href="/orders"
              className="text-primary hover:underline"
            >
              My Orders
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
