"use client";

import { useState, useEffect } from "react";
import CartHeader from "@/components/blocks/cart/CartHeader";
import CartItemsList from "@/components/blocks/cart/CartItemsList";
import CartSummary from "@/components/blocks/cart/CartSummary";
import EmptyCart from "@/components/blocks/cart/EmptyCart";
import RecommendedProducts from "@/components/blocks/cart/RecommendedProducts";

import { CartItemFlower, RecommendedProduct } from "../../../models/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItemFlower[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [savedItems, setSavedItems] = useState<CartItemFlower[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("cart");
    const parsed = data ? JSON.parse(data) : [];
    setItems(parsed);
    setSelectedItems(parsed.map((item: CartItemFlower) => item.id));
  }, []);

  const recommendedProducts: RecommendedProduct[] = [
    {
      id: "5",
      name: "Túi xách da bò",
      price: 450000,
      originalPrice: 650000,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=150",
      rating: 4.5,
      reviewCount: 24,
      discount: 31
    },
    {
      id: "6",
      name: "Đồng hồ thông minh",
      price: 1890000,
      originalPrice: 2490000,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150",
      rating: 4.8,
      reviewCount: 156,
      discount: 24
    }
  ];

  const subtotal = items
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSelectAll = (selected: boolean) => {
    setSelectedItems(selected ? items.map(item => item.id) : []);
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleRemoveSelected = () => {
    setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleClearCart = () => {
    setItems([]);
    setSelectedItems([]);
  };

  const handleSaveForLater = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      handleRemoveItem(id);
      alert("Đã lưu sản phẩm để mua sau!");
    }
  };

  const handleAddRecommended = (product: RecommendedProduct) => {
    const newItem: CartItemFlower = {
      id: Date.now().toString(),
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };
    setItems(prev => [...prev, newItem]);
    setSelectedItems(prev => [...prev, newItem.id]);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const handleQuickView = (product: RecommendedProduct) => {
    alert(`Xem nhanh: ${product.name}`);
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <CartHeader itemCount={0} onClearCart={handleClearCart} />
        <EmptyCart />
        <div className="mt-8">
          <RecommendedProducts
            products={recommendedProducts}
            onAddToCart={handleAddRecommended}
            onQuickView={handleQuickView}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <CartHeader itemCount={items.length} onClearCart={handleClearCart} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemsList
            items={items}
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onSelectItem={handleSelectItem}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onRemoveSelected={handleRemoveSelected}
            onSaveForLater={handleSaveForLater}
          />
        </div>

        <div>
          <CartSummary
            subtotal={subtotal}
            selectedCount={selectedItems.length}
            totalItems={items.length}
            cartItems={items.filter(item => selectedItems.includes(item.id))}
          />
        </div>
      </div>

      <div className="mt-12">
        <RecommendedProducts
          products={recommendedProducts}
          onAddToCart={handleAddRecommended}
          onQuickView={handleQuickView}
        />
      </div>
    </div>
  );
}
