import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface ProductInfoProps {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
}

export default function ProductInfo({
  name,
  category,
  price,
  stock,
  description,
}: ProductInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Category & Name */}
      <div className="space-y-4">
        {category && (
          <Badge
            variant="secondary"
            className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20"
          >
            {category}
          </Badge>
        )}

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {name}
        </h1>

        <div className="flex items-center gap-4">
          <Badge
            variant="outline"
            className="px-3 py-1 text-green-600 border-green-600 bg-green-50"
          >
            <div className="h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse" />
            In Stock
          </Badge>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground">
            {stock} units available
          </div>
        </div>
      </div>

      {/* Price Card */}
      <Card className="border-2 rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(price * 1.2)}
            </span>
            <Badge className="ml-2 bg-red-500 hover:bg-red-600">
              20% OFF
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-primary rounded-full" />
            </div>
            <span>Only 5 left at this price!</span>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {description && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}