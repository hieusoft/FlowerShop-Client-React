"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ProductService from "@/lib/api/ProductService";
import { useEffect, useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

interface GiftMessageStepProps {
  formData: { giftMessage: string };
  onInputChange: (field: string, value: string) => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Greeting {
  _id: string;
  text: string;
  subOccasionId: string;
  updatedAt: string;
}

export default function GiftMessageStep({ formData, onInputChange }: GiftMessageStepProps) {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGreetings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const checkoutStr = localStorage.getItem("checkoutData");

      if (!checkoutStr) {
        setGreetings([]);
        setLoading(false);
        return;
      }

      // ❗ FIX: Parse đúng object trước
      const checkoutObj = JSON.parse(checkoutStr);

      // ❗ FIX: Lấy đúng cartItems từ object
      const cartItems: CartItem[] = checkoutObj.cartItems || [];

      const allGreetings: Greeting[] = [];
      const fetchedIds = new Set<string>();

      await Promise.all(
        cartItems.map(async (item) => {
          try {
            const productData = await ProductService.fromId(item.id);

            if (productData.data.greetings?.length > 0) {
              productData.data.greetings.forEach((g: Greeting) => {
                if (!fetchedIds.has(g._id)) {
                  fetchedIds.add(g._id);
                  allGreetings.push(g);
                }
              });
            }
          } catch (err) {
            console.error(`Error fetching product ${item.id}:`, err);
          }
        })
      );

      const sorted = allGreetings.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setGreetings(sorted);
    } catch (error) {
      console.error("Error fetching greetings:", error);
      setError("Failed to load greetings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGreetings();
  }, [fetchGreetings]);

  const handleGreetingSelect = (value: string) => {
    const selected = greetings.find((g) => g._id === value);
    if (selected) onInputChange("giftMessage", selected.text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Message</CardTitle>
        <CardDescription>Write a message to include with your order (optional)</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Pre-written greetings</label>

            {greetings.length > 0 && (
              <Button variant="ghost" size="sm" onClick={fetchGreetings} disabled={loading} className="h-8 px-2">
                <RefreshCw className={`h-3 w-3 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Loading greetings...</span>
            </div>
          ) : error ? (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchGreetings} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : greetings.length > 0 ? (
            <Select onValueChange={handleGreetingSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a greeting to use" />
              </SelectTrigger>
              <SelectContent>
                {greetings.map((g) => (
                  <SelectItem key={g._id} value={g._id} className="py-3">
                    <div className="line-clamp-2 text-sm">{g.text}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">
              No pre-written greetings available for items in your cart.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Custom message <span className="text-muted-foreground ml-1">(optional)</span>
          </label>

          <Textarea
            placeholder="Write your personal message here…"
            value={formData.giftMessage}
            onChange={(e) => onInputChange("giftMessage", e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">Your message will be included with the gift delivery.</p>
        </div>

      </CardContent>
    </Card>
  );
}
