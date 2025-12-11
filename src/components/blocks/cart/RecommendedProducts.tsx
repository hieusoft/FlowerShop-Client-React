// /app/cart/components/RecommendedProducts.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { RecommendedProduct } from "../../../models/cart";

interface RecommendedProductsProps {
  products: RecommendedProduct[];
  onAddToCart: (product: RecommendedProduct) => void;
  onQuickView: (product: RecommendedProduct) => void;
}

export default function RecommendedProducts({
  products,
  onAddToCart,
  onQuickView,
}: RecommendedProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (products.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Sản phẩm đề xuất cho bạn
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {product.discount && (
                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                    -{product.discount}%
                  </Badge>
                )}
                
                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-white hover:bg-gray-100 text-gray-800"
                    onClick={() => onQuickView(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h4 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h4>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-base">
                      {formatCurrency(product.price)}
                    </p>
                    {product.originalPrice > product.price && (
                      <p className="text-xs text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => onAddToCart(product)}
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}