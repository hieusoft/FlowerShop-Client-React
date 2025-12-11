// /app/checkout/components/PaymentStep.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  ArrowLeft,
} from "lucide-react";

interface PaymentStepProps {
  formData: {
    shippingMethod: string;
    paymentMethod: string;
    acceptTerms: boolean;
  };
  onInputChange: (field: string, value: string | boolean) => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  onPrevStep: () => void;
}

export default function PaymentStep({
  formData,
  onInputChange,
  onPlaceOrder,
  isProcessing,
  onPrevStep,
}: PaymentStepProps) {
  return (
    <>
      {/* Shipping Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Phương thức vận chuyển
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.shippingMethod}
            onValueChange={(value) => onInputChange("shippingMethod", value)}
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 mb-2 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="standard" id="standard" />
              <div className="flex-1">
                <Label htmlFor="standard" className="cursor-pointer">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Giao hàng tiêu chuẩn</p>
                      <p className="text-sm text-gray-500">
                        Giao hàng trong 3-5 ngày làm việc
                      </p>
                    </div>
                    <span className="font-medium">30.000đ</span>
                  </div>
                </Label>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="express" id="express" />
              <div className="flex-1">
                <Label htmlFor="express" className="cursor-pointer">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Giao hàng nhanh</p>
                      <p className="text-sm text-gray-500">
                        Giao hàng trong 1-2 ngày làm việc
                      </p>
                    </div>
                    <span className="font-medium">50.000đ</span>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Phương thức thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => onInputChange("paymentMethod", value)}
          >
            <div className="flex items-center space-x-2 rounded-lg border p-4 mb-2 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="cod" id="cod" />
              <div className="flex-1">
                <Label htmlFor="cod" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                        <p className="text-sm text-gray-500">
                          Thanh toán bằng tiền mặt khi nhận hàng
                        </p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 mb-2 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="bank" id="bank" />
              <div className="flex-1">
                <Label htmlFor="bank" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                        <p className="text-sm text-gray-500">
                          Chuyển khoản qua tài khoản ngân hàng
                        </p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="card" id="card" />
              <div className="flex-1">
                <Label htmlFor="card" className="cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Thẻ tín dụng/ghi nợ</p>
                        <p className="text-sm text-gray-500">
                          Thanh toán an toàn qua cổng VNPAY
                        </p>
                      </div>
                    </div>
                    <img
                      src="https://via.placeholder.com/80x30"
                      alt="Payment methods"
                      className="h-6"
                    />
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => onInputChange("acceptTerms", checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-none">
              Tôi đồng ý với{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary hover:underline">
                    điều khoản và điều kiện
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Điều khoản và điều kiện</DialogTitle>
                    <DialogDescription>
                      Vui lòng đọc kỹ các điều khoản trước khi đặt hàng...
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>{" "}
              của cửa hàng
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <Button
          onClick={onPlaceOrder}
          disabled={isProcessing || !formData.acceptTerms}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Đặt hàng
            </>
          )}
        </Button>
      </div>
    </>
  );
}