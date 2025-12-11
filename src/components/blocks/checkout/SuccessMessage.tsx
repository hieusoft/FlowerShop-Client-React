// /app/checkout/components/SuccessMessage.tsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { CheckoutFormData } from "../../../models/checkout";

interface SuccessMessageProps {
  orderNumber: string;
  formData: CheckoutFormData;
}

export default function SuccessMessage({ orderNumber, formData }: SuccessMessageProps) {
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
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
          <CardTitle className="text-2xl">Đặt hàng thành công!</CardTitle>
          <CardDescription>
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Mã đơn hàng của bạn</p>
            <p className="text-2xl font-bold text-primary">{orderNumber}</p>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Chúng tôi đã gửi xác nhận đơn hàng đến email của bạn. 
              Vui lòng kiểm tra hộp thư đến và thư rác.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Thông tin giao hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{formData.fullName}</p>
                <p className="text-sm text-gray-600">{formData.phone}</p>
                <p className="text-sm text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-600 mt-2">{formData.address}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {formData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                   formData.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 
                   'Thẻ tín dụng/ghi nợ'}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Tổng thanh toán: {formatCurrency(calculateTotal())}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Thời gian giao hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {formData.shippingMethod === 'express' ? 'Giao hàng nhanh' : 'Giao hàng tiêu chuẩn'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.shippingMethod === 'express' ? '1-2 ngày làm việc' : '3-5 ngày làm việc'}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={() => window.print()}>
              In hóa đơn
            </Button>
            <Button onClick={() => router.push('/orders')}>
              Theo dõi đơn hàng
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Tiếp tục mua sắm
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Bạn có thể theo dõi trạng thái đơn hàng trong mục <a href="/orders" className="text-primary hover:underline">Đơn hàng của tôi</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}