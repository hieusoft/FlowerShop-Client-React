// /app/cart/components/EmptyCart.tsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight, TrendingUp } from "lucide-react";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <Card className="border-dashed">
      <CardContent className="py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">Giỏ hàng trống</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời và thêm chúng vào giỏ hàng!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2"
            onClick={() => router.push("/")}
          >
            <ArrowRight className="h-5 w-5" />
            Tiếp tục mua sắm
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => router.push("/products?sort=trending")}
          >
            <TrendingUp className="h-5 w-5" />
            Xem sản phẩm nổi bật
          </Button>
        </div>
        
        {/* Popular Categories */}
        <div className="mt-12">
          <h4 className="font-semibold mb-4">Khám phá danh mục phổ biến</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Thời trang nam", color: "bg-blue-50 text-blue-700" },
              { name: "Thời trang nữ", color: "bg-pink-50 text-pink-700" },
              { name: "Điện tử", color: "bg-purple-50 text-purple-700" },
              { name: "Nhà cửa đời sống", color: "bg-green-50 text-green-700" },
            ].map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className={`h-auto py-3 ${category.color} hover:opacity-90`}
                onClick={() => router.push(`/products?category=${category.name}`)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}