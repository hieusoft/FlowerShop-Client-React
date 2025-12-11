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

interface CheckoutData {
  items?: Array<{
    bouquet_id?: number;
    id?: string;
    price: number;
    quantity: number;
  }>;
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

interface CheckoutSummary {
  subtotal: string;
  shippingFee: string;
  discount: string;
  tax: string;
  total: string;
  couponCode: string;
  discountText: string;
  itemCount: number;
}

export default function OrderSummary() {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);
  const [cartItems, setCartItems] = useState<CartItemFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    try {
      console.log("Loading checkout data from localStorage...");
      
      const checkoutDataStr = localStorage.getItem("checkoutData");
      const summaryStr = localStorage.getItem("checkoutSummary");
      const cartItemsStr = localStorage.getItem("checkoutCartItems");

      console.log("checkoutData:", checkoutDataStr);
      console.log("cartItems:", cartItemsStr);

     
      if (cartItemsStr) {
        try {
          const items = JSON.parse(cartItemsStr) as CartItemFlower[];
          if (Array.isArray(items)) {
            console.log("Parsed cart items:", items);
            setCartItems(items);
          } else {
            console.error("cartItems is not an array:", items);
          }
        } catch (err) {
          console.error("Error parsing cart items:", err);
        }
      }

      if (!checkoutDataStr && !cartItemsStr) {
        setError("Order information not found. Please return to the cart.");
        setLoading(false);
        return;
      }

   
      if (checkoutDataStr) {
        try {
          const data = JSON.parse(checkoutDataStr) as CheckoutData;
          console.log("Parsed checkout data:", data);
          setCheckoutData(data);
        } catch (err) {
          console.error("Error parsing checkout data:", err);
        }
      }

      // Load summary
      if (summaryStr) {
        try {
          const summary = JSON.parse(summaryStr) as CheckoutSummary;
          console.log("Parsed summary:", summary);
          setCheckoutSummary(summary);
        } catch (err) {
          console.error("Error parsing summary:", err);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading checkout data:", err);
      setError("An error occurred while loading order information.");
      setLoading(false);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  };

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

  // Calculate subtotal from cartItems if checkoutData isn't available
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Use checkoutData or fallback values
  const shippingFee = checkoutData?.shippingFee || 0;
  const discount = checkoutData?.discount || 0;
  const tax = checkoutData?.tax || subtotal * 0.08;
  const total = checkoutData?.total || subtotal + shippingFee + tax - discount;

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-yellow-600 font-medium">No items in your order</p>
            <p className="text-sm text-gray-500 mt-2">
              Please return to the cart and select items before checkout.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.history.back()}
            >
              Back to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {/* Cart items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.image && (
                  <img
                    src={`http://localhost:3000/api${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  {item.subOccasion && (
                    <p className="text-xs text-gray-500">{item.subOccasion.name}</p>
                  )}
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

          {/* Coupon Code Display */}
          {checkoutData?.couponCode && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div>
                  <p className="text-sm font-medium">Applied Coupon</p>
                  <p className="text-xs text-gray-500">{checkoutData.couponCode}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {checkoutSummary?.discountText || "Applied"}
                </Badge>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="space-y-3 mt-6">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Subtotal ({selectedCount} items)
              </span>
              <span>{checkoutSummary?.subtotal || formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Fee</span>
              <span>
                {checkoutSummary?.shippingFee ||
                  (shippingFee > 0 ? formatCurrency(shippingFee) : "FREE")}
              </span>
            </div>

            {tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (8%)</span>
                <span>{checkoutSummary?.tax || formatCurrency(tax)}</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  {checkoutSummary?.discount || `-${formatCurrency(discount)}`}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{checkoutSummary?.total || formatCurrency(total)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <Package className="h-4 w-4" />
              <span>{cartItems.length} item types</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 border-t">
          <p className="text-sm text-gray-500 text-center">
            By placing this order, you agree to our Terms of Service.
          </p>
        </CardFooter>
      </Card>

      {/* Security Badges */}
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
