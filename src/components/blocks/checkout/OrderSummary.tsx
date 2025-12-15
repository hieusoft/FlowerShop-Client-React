"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Shield, Lock, AlertCircle, Package } from "lucide-react";

interface CartItemFlower {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image: string;
  subOccasion?: {
    id: string;
    name: string;
    description?: string;
  };
}

interface CheckoutDataRaw {
  cartItems: CartItemFlower[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  couponCode: string;
  couponDetails: {
    discount_type: "percent" | "amount";
    discount_value: number;
    coupon_id?: number;
  } | null;
  selectedCount: number;
  totalItems: number;
  timestamp: string;
}

interface CheckoutData extends CheckoutDataRaw {
  items: CartItemFlower[];
}

export default function OrderSummary() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const str = localStorage.getItem("checkoutData");
      if (!str) {
        setError("Order information not found. Please return to the cart.");
        setLoading(false);
        return;
      }

      const data = JSON.parse(str) as CheckoutDataRaw;

      if (!data.cartItems || !Array.isArray(data.cartItems)) {
        setError("Invalid order information.");
        setLoading(false);
        return;
      }

      setCheckoutData({
        ...data,
        items: data.cartItems,
      });

      setLoading(false);
    } catch {
      setError("Failed to load order information.");
      setLoading(false);
    }
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading your order...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !checkoutData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
              Back to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { items, subtotal, shippingFee, discount, tax, total, couponCode, couponDetails, selectedCount } =
    checkoutData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Order
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={`http://localhost:3000/api${item.image}`}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />

                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>

                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                    <p className="font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {couponCode && couponDetails && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <p className="text-sm font-medium">Applied Coupon</p>
                  <p className="text-xs text-gray-500">{couponCode}</p>
                </div>

                <Badge className="bg-green-100 text-green-800">
                  {couponDetails.discount_type === "percent"
                    ? `${couponDetails.discount_value}% off`
                    : `${formatCurrency(couponDetails.discount_value)} off`}
                </Badge>
              </div>
            </div>
          )}

          <div className="space-y-3 mt-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({selectedCount} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Fee</span>
              <span>{shippingFee > 0 ? formatCurrency(shippingFee) : "FREE"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">VAT (8%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <Package className="h-4 w-4" />
              <span>{items.length} item types</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 border-t">
          <p className="text-sm text-gray-500 text-center">
            By placing this order, you agree to our Terms of Service.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-xs font-medium">Secure</p>
              <p className="text-xs text-gray-500">SSL 256-bit</p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-xs font-medium">Safe</p>
              <p className="text-xs text-gray-500">Secure Payments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
