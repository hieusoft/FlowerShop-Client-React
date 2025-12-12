import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardThumbnail } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bouquet } from "@/models/bouquet";
import { ShoppingBasketIcon } from "lucide-react";
import { ClassNameValue } from "tailwind-merge";

export function BouquetCard(
    { bouquet, className }: {
        bouquet: Bouquet,
        className?: ClassNameValue
    }
) {
    return (
        <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1", className)}>
            <CardThumbnail className="overflow-hidden">
                <div className="relative w-full h-56 md:h-64">
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={"/api/" + bouquet.images[0]}
                        alt={bouquet.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </CardThumbnail>
            <CardHeader className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold font-heading line-clamp-2 text-gray-900">
                        {bouquet.name}
                    </h3>
                    <p className="text-xl font-bold text-rose-600 whitespace-nowrap">
                        ${bouquet.price.toFixed(2)}
                    </p>
                </div>
                
            </CardHeader>
            <CardDescription className="px-4">
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {bouquet.description}
                </p>
            </CardDescription>
            <CardFooter className="pt-4">
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white transition-all duration-200 hover:shadow-md">
                    <ShoppingBasketIcon className="mr-2 h-4 w-4" />
                    Add to Basket
                </Button>
            </CardFooter>
        </Card>
    );
}