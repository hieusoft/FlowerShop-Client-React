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
        <Card className={cn(className)}>
            <CardThumbnail>
                <picture className="w-full h-full">
                    <img
                        className="w-full h-full object-cover"
                        src={"/api/" + bouquet.images[0]}
                        alt=""
                    ></img>
                </picture>
            </CardThumbnail>
            <CardHeader>
                <h3 className="text-2xl font-heading line-clamp-2">
                    {bouquet.name}
                </h3>
                <p className="text-xl font-bold font-heading -mt-1 mb-1">
                    USD {bouquet.price}
                </p>
            </CardHeader>
            <CardDescription>
                <p className="line-clamp-3">
                    {bouquet.description}
                </p>
            </CardDescription>
            <CardFooter className="flex gap-2">
                <Button className="flex-1">
                    <ShoppingBasketIcon/>
                    Add to Basket
                </Button>
            </CardFooter>
        </Card>
    )
}