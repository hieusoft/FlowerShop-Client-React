"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Heart, Share2 } from "lucide-react";
import { CartItemFlower } from "../../../models/cart";

interface CartItemProps {
  item: CartItemFlower;
  selected: boolean;
  onSelect: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
}

export default function CartItem({
  item,
  selected,
  onSelect,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
}: CartItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (amount: number) =>
     new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  const totalPrice = item.price * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${
        selected ? "border-primary ring-1 ring-primary" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Checkbox */}
          <div className="flex items-start pt-2">
            <Checkbox
              checked={selected}
              onCheckedChange={() => onSelect(item.id)}
            />
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={`http://localhost:3000/api${item.image}`}
              alt={item.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            {item.quantity > 1 && (
              <Badge className="absolute -top-2 -right-2 bg-primary">
                {item.quantity}
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-base">{item.name}</h3>
              {item.subOccasion && (
                <p className="text-sm text-muted-foreground">
                   {item.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground"> {item.id}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="h-4 w-4 text-black-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSaveForLater(item.id)}
              >
                <Heart className="h-4 w-4 text-black-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="font-bold">{formatCurrency(totalPrice)}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(item.price)} / bouquet
              </p>
            </div>

            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                value={item.quantity}
                min={1}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                className="w-16 h-8 text-center border-0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= 10}
              >
                +
              </Button>
            </div>

            {item.subOccasion && (
              <Badge variant="outline">{item.subOccasion.name}</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
