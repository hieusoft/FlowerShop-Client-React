"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Tag,
  Shield,
  Truck,
  ArrowRight,
  Lock,
} from "lucide-react";
import CouponService from "@/lib/api/CouponService";
import UserService from "@/lib/api/UserService";
interface CartSummaryProps {
  subtotal: number;
  selectedCount: number;
  totalItems: number;
  cartItems?: any[];
}

export default function CartSummary({
  subtotal,
  selectedCount,
  totalItems,
  cartItems = [],
}: CartSummaryProps) {
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponDetails, setCouponDetails] = useState<{
    discount_type: "percent" | "amount";
    discount_value: number;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("checkoutData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.couponCode && data.couponDetails) {
          setCouponCode(data.couponCode);
          setCouponApplied(true);
          setCouponDetails(data.couponDetails);
        }
      } catch {}
    }
  }, []);

  const shippingFee = selectedCount > 0 ? 2 : 0;

  let discount = 0;
  if (couponApplied && couponDetails) {
    if (couponDetails.discount_type === "percent") {
      discount = subtotal * (couponDetails.discount_value / 100);
    } else {
      discount = couponDetails.discount_value;
    }
  }

  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal + shippingFee + tax - discount);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const userRes = await UserService.profile();
      const user = userRes.data;
      console.log("ád",user)
      if (!user?.userId) {
        setCouponError("Please login to use coupon");
        return;
      }

      const res = await CouponService.validateCoupon(
        couponCode,
        subtotal,
        user.userId
      );

      if (res.data?.data?.valid) {
        const c = res.data.data;

        if (subtotal < c.min_price) {
          setCouponError(
            `Minimum order amount is ${formatCurrency(c.min_price)}`
          );
          setCouponApplied(false);
          setCouponDetails(null);
          return;
        }

        setCouponApplied(true);
        setCouponDetails({
          discount_type: c.discount_type,
          discount_value: c.discount_value,
        });
        setCouponError("");
      } else {
        setCouponApplied(false);
        setCouponDetails(null);
        setCouponError("Invalid or expired coupon code");
      }
    } catch (error: any) {
      setCouponApplied(false);
      setCouponDetails(null);
      setCouponError(
        error?.response?.data?.error || "Failed to validate coupon"
      );
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDetails(null);
    setCouponCode("");
    setCouponError("");

    const saved = localStorage.getItem("checkoutData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        data.couponCode = "";
        data.couponDetails = null;
        data.discount = 0;
        localStorage.setItem("checkoutData", JSON.stringify(data));
      } catch {}
    }
  };

  const saveToLocalStorage = () => {
    const checkoutData = {
      subtotal,
      shippingFee,
      discount,
      tax,
      total,
      couponCode: couponApplied ? couponCode : "",
      couponDetails,
      selectedCount,
      totalItems,
      cartItems,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  };

  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert("Please select at least one item to proceed to checkout");
      return;
    }

    saveToLocalStorage();
    router.push("/checkout");
  };

  const getDiscountText = () => {
    if (!couponDetails) return "";
    return couponDetails.discount_type === "percent"
      ? `${couponDetails.discount_value}% off`
      : `${formatCurrency(couponDetails.discount_value)} off`;
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800">
            {selectedCount} item(s) selected
          </p>
          <p className="text-xs text-blue-600">
            Total {totalItems} item(s) in cart
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                className={couponError ? "border-red-300" : ""}
              />
              {couponError && (
                <p className="text-xs text-red-500 mt-1">{couponError}</p>
              )}
            </div>

            {couponApplied ? (
              <Button
                variant="outline"
                onClick={handleRemoveCoupon}
                className="gap-2"
              >
                Remove
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={handleApplyCoupon}
                className="gap-2"
              >
                <Tag className="h-4 w-4" />
                Apply
              </Button>
            )}
          </div>

          {couponApplied && couponDetails && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Coupon applied: {getDiscountText()}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping Fee</span>
            <span>
              {shippingFee > 0 ? formatCurrency(shippingFee) : "FREE"}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (VAT 8%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-4">
        <Button
          className="w-full gap-2 h-12 text-base"
          onClick={handleCheckout}
          disabled={selectedCount === 0}
        >
          <Lock className="h-5 w-5" />
          Secure Checkout
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
