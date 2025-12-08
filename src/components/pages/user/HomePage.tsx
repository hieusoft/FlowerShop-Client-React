import { HomeCarousel } from "@/components/blocks/home/home-carousel"
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardThumbnail } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { apiInstance, BASE_URL, serverApiInstance } from "@/lib/api"
import { Bouquet } from "@/models/bouquet";
import { PaginateResult } from "@/models/common";
import { ShoppingBasketIcon } from "lucide-react";

const bannerImages = [
    {
        src: "https://placehold.co/1080x220?text=Promotional+Image+1&font=Playfair+Display",
        alt: "Promotional Image 1"
    },
    {
        src: "https://placehold.co/1080x220/orange/red?text=Promotional+Image+2&font=Playfair+Display",
        alt: "Promotional Image 2"
    },
    {
        src: "https://placehold.co/1080x220/red/white?text=Promotional+Image+3&font=Playfair+Display",
        alt: "Promotional Image 3"
    },
]

// TODO Implement page
export default async function HomePage() {
    const cardBasises = "md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5";

    const latestBouquets = (await serverApiInstance.get("bouquets")).data as PaginateResult<Bouquet>;

    return <>
        <div className="max-w-480 mx-auto mb-10">
            <HomeCarousel items={bannerImages} />
        </div>
        <div className="mt-8">
            <h2 className="container mx-auto mb-4 text-4xl font-heading">
                Browse our flowers
            </h2>
            <Carousel className="">
                <CarouselContent>
                    {latestBouquets.data.map((bouquet, index) => (
                        <CarouselItem className={cardBasises} key={index}>
                            <Card className="h-full border-0 border-x -ml-px rounded-none">
                                <CardThumbnail>
                                    <picture className="w-full h-full">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={new URL(bouquet.images[0], BASE_URL).toString()}
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
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    </>
}