import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Quantity</Label>
      <div className="flex items-center gap-4">
        <div className="flex items-center border-2 rounded-xl overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDecrement}
            disabled={quantity <= 1}
            className="h-12 w-12 rounded-none hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="h-12 w-20 flex items-center justify-center border-x bg-muted/30">
            <span className="text-xl font-bold">{quantity}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onIncrement}
            disabled={quantity >= max}
            className="h-12 w-12 rounded-none hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Max. {max} per customer
        </div>
      </div>
    </div>
  );
}