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

interface CartSummaryProps {
  subtotal: number;
  selectedCount: number;
  totalItems: number;
  cartItems?: any[];
}

interface CouponResponse {
  message: string;
  coupon: {
    valid: boolean;
    coupon_id: number;
    discount_type: "percent" | "amount";
    discount_value: number;
    min_price: number;
  };
}

interface CheckoutData {
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  total: number;
  couponCode: string;
  couponDetails: {
    discount_type: "percent" | "amount";
    discount_value: number;
  } | null;
  selectedCount: number;
  totalItems: number;
  timestamp: string;
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
    const savedCheckoutData = localStorage.getItem("checkoutData");
    if (savedCheckoutData) {
      try {
        const data = JSON.parse(savedCheckoutData);
        if (data.couponCode && data.couponDetails) {
          setCouponCode(data.couponCode);
          setCouponApplied(true);
          setCouponDetails(data.couponDetails);
        }
      } catch (error) {
        console.error("Error loading saved checkout data:", error);
      }
    }
  }, []);

  const shippingFee = selectedCount > 0 ? 2 : 0;

  let discount = 0;
  if (couponApplied && couponDetails) {
    if (couponDetails.discount_type === "percent") {
      discount = subtotal * (couponDetails.discount_value / 100);
    } else if (couponDetails.discount_type === "amount") {
      discount = couponDetails.discount_value;
    }
  }
  
  const tax = (subtotal - discount) * 0.08;
  const total = Math.max(0, subtotal + shippingFee + tax - discount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const res = await CouponService.validateCoupon(couponCode, subtotal);
      
      if (res.data?.coupon?.valid) {
        const couponData = res.data.coupon;
        
      
        if (subtotal < couponData.min_price) {
          setCouponError(`Minimum order amount is ${formatCurrency(couponData.min_price)}`);
          setCouponApplied(false);
          setCouponDetails(null);
          return;
        }
        
        setCouponApplied(true);
        setCouponDetails({
          discount_type: couponData.discount_type,
          discount_value: couponData.discount_value
        });
        setCouponError("");
      } else {
        setCouponApplied(false);
        setCouponDetails(null);
        setCouponError("Invalid or expired coupon code");
      }
    } catch (error: any) {
      console.error("Coupon error:", error);
      setCouponApplied(false);
      setCouponDetails(null);
      setCouponError(error?.response?.data?.error || "Failed to validate coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponDetails(null);
    setCouponCode("");
    setCouponError("");
  
    const savedCheckoutData = localStorage.getItem("checkoutData");
    if (savedCheckoutData) {
      try {
        const data = JSON.parse(savedCheckoutData);
        data.couponCode = "";
        data.couponDetails = null;
        data.discount = 0;
        localStorage.setItem("checkoutData", JSON.stringify(data));
      } catch (error) {
        console.error("Error removing coupon from localStorage:", error);
      }
    }
  };

  const saveToLocalStorage = () => {
    const checkoutData: CheckoutData = {
      subtotal,
      shippingFee,
      discount,
      tax,
      total,
      couponCode: couponApplied ? couponCode : "",
      couponDetails,
      selectedCount,
      totalItems,
      timestamp: new Date().toISOString(),
    };

    // Lưu dữ liệu checkout
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    // Lưu thêm cart items nếu có (tuỳ vào cách bạn quản lý cart)
    if (cartItems && cartItems.length > 0) {
      localStorage.setItem("checkoutCartItems", JSON.stringify(cartItems));
    }

    
    const summaryData = {
      subtotal: formatCurrency(subtotal),
      shippingFee: shippingFee > 0 ? formatCurrency(shippingFee) : "FREE",
      discount: discount > 0 ? formatCurrency(discount) : "$0.00",
      tax: formatCurrency(tax),
      total: formatCurrency(total),
      couponCode: couponApplied ? couponCode : "None",
      discountText: couponApplied && couponDetails ? getDiscountText() : "No discount applied",
    };
    
    localStorage.setItem("checkoutSummary", JSON.stringify(summaryData));
  };

  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert("Please select at least one item to proceed to checkout");
      return;
    }

    // Lưu dữ liệu vào localStorage trước khi chuyển trang
    saveToLocalStorage();

    // Chuyển đến trang checkout
    router.push("/checkout");
  };

  const getDiscountText = () => {
    if (!couponDetails) return "";
    
    if (couponDetails.discount_type === "percent") {
      return `${couponDetails.discount_value}% off`;
    } else {
      return `${formatCurrency(couponDetails.discount_value)} off`;
    }
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
        {/* Selected Items Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-blue-800">
            {selectedCount} item(s) selected
          </p>
          <p className="text-xs text-blue-600">
            Total {totalItems} item(s) in cart
          </p>
        </div>

        {/* Coupon Section */}
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

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping Fee</span>
            <span>{shippingFee > 0 ? formatCurrency(shippingFee) : "FREE"}</span>
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

        {/* Shipping Info */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-3 mb-2">
            <Truck className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Shipping Information</span>
          </div>
          <p className="text-xs text-gray-500 ml-7">
            Standard shipping: {shippingFee === 0 ? "FREE" : formatCurrency(shippingFee)}<br />
            For orders over $22, shipping is free. Delivery within 1-3 days.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-2">Accepted Payment Methods:</p>
          <div className="flex gap-2">
            {["VISA", "MasterCard", "OXAPAY", "VNPAY", "Momo"].map((method) => (
              <div
                key={method}
                className="flex-1 h-10 bg-gray-50 rounded flex items-center justify-center text-base font-semibold text-gray-700 
                         hover:bg-gray-200 hover:text-black transition-colors duration-200 cursor-pointer"
              >
                {method}
              </div>
            ))}
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

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>30-day money-back guarantee</span>
        </div>

        <p className="text-xs text-gray-400 text-center">
          By proceeding with payment, you agree to our{" "}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}