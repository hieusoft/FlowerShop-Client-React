"use client";

import { useEffect, useRef, useState } from "react";
import CartHeader from "@/components/blocks/cart/CartHeader";
import CartItemsList from "@/components/blocks/cart/CartItemsList";
import CartSummary from "@/components/blocks/cart/CartSummary";
import { CartItemFlower, RecommendedProduct } from "../../../models/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItemFlower[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;

    const data = localStorage.getItem("cart");
    const parsed: CartItemFlower[] = data ? JSON.parse(data) : [];

    setItems(parsed);
    setSelectedItems(parsed.map(item => item.id));

    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

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
    if (!item) return;
    setItems(prev => prev.filter(i => i.id !== id));
    setSelectedItems(prev => prev.filter(i => i !== id));
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
  };

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
            cartItems={items.filter(item =>
              selectedItems.includes(item.id)
            )}
          />
        </div>
      </div>
    </div>
  );
}
