import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap } from "lucide-react";

interface ActionButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  disabled?: boolean;
}

export default function ActionButtons({
  onAddToCart,
  onBuyNow,
  disabled = false,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <Button
        size="lg"
        className="flex-1 h-14 text-lg gap-3 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={onAddToCart}
        disabled={disabled}
      >
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="flex-1 h-14 text-lg gap-3 rounded-xl border-2 hover:border-primary hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300"
        onClick={onBuyNow}
        disabled={disabled}
      >
        <Zap className="h-5 w-5" />
        Buy Now
      </Button>
    </div>
  );
}