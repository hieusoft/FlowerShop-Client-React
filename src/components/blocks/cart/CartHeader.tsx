"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CartHeaderProps {
  itemCount: number;
  onClearCart: () => void;
}

export default function CartHeader({
  itemCount,
  onClearCart,
}: CartHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <ShoppingCart className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-muted-foreground">
          You have{" "}
          <span className="font-semibold text-primary">{itemCount} items</span>{" "}
          in your cart
        </p>

        <div className="flex items-center gap-3">
          {/* AlertDialog for Clear All */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-black hover:text-black hover:bg-gray-100 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Clear Cart</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove all items from your cart? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-3 mt-4">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClearCart}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Yes, Clear
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Continue Shopping */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-black hover:text-black hover:bg-gray-100 cursor-pointer"
            onClick={() => window.history.back()}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
