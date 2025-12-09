import { BouquetCard } from "@/components/blocks/bouquet/BouquetCard";
import { HomeCarousel } from "@/components/blocks/home/home-carousel"
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardThumbnail } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { serverApiInstance } from "@/lib/api"
import { Bouquet } from "@/models/bouquet";
import { PaginateResult } from "@/models/common";
import { Occasion } from "@/models/occasion";
import { ShoppingBasketIcon } from "lucide-react";
import Link from "next/link";

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
    const largeCardBasises = "md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5";
    const smallCardBasises = "basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6";

    const latestBouquets = (await serverApiInstance.get("bouquets")).data as PaginateResult<Bouquet>;
    const allOccasions = (await serverApiInstance.get("occasions")).data as Occasion[];
    // const allFlowers = (await serverApiInstance.get("flowers")).data as Occasion[];

    return <>
        <div className="max-w-480 mx-auto mb-10">
            <HomeCarousel items={bannerImages} />
        </div>
        <div className="mt-8">
            <h2 className="container mx-auto px-8 mb-4 text-4xl font-heading">
                Browse our flowers
            </h2>
            <Carousel opts={{align: "start", loop: true}} className="">
                <CarouselContent>
                    {/** TODO add flowers */}
                    {allOccasions.map((occasion) => <>
                        {occasion.subOccasions.map((subOccasion) => <>
                            <CarouselItem className={smallCardBasises} key={subOccasion._id}>
                                <Link href="/search" className="block h-full">
                                    <Card className="h-full border-0 border-x -ml-px rounded-none">
                                        <CardThumbnail className="aspect-2/1">
                                            <picture className="w-full h-full">
                                                {/** TODO replace placeholder */}
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src="https://placehold.co/300x400?text=Thumbnail"
                                                    alt=""
                                                ></img>
                                            </picture>
                                        </CardThumbnail>
                                        <CardHeader className="h-full flex items-center justify-center">
                                            <h3 className="text-2xl font-heading line-clamp-2">
                                                {subOccasion.name}
                                            </h3>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        </>)}
                    </>)}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
        <div className="mt-8">
            <h2 className="container mx-auto px-8 mb-4 text-4xl font-heading">
                Our latest picks
            </h2>
            <Carousel opts={{align: "start"}} className="">
                <CarouselContent>
                    {latestBouquets.data.map((bouquet, index) => (
                        <CarouselItem className={largeCardBasises} key={index}>
                            <BouquetCard 
                                bouquet={bouquet} 
                                className="h-full border-0 border-x -ml-px rounded-none" />
                        </CarouselItem>
                    ))}
                    <CarouselItem className={largeCardBasises}>
                        <Link href="/search" className="h-full">
                            <Card className="h-full border-0 border-x -ml-px rounded-none">
                                <CardHeader className="h-full flex items-center justify-center">
                                    <h3 className="text-2xl font-heading line-clamp-2">
                                        View more bouquets...
                                    </h3>
                                </CardHeader>
                            </Card>
                        </Link>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
        <div className="mt-8">
            <h2 className="container mx-auto px-8 mb-4 text-4xl font-heading">
                Flowers for every occasion
            </h2>
            <Carousel opts={{align: "start", loop: true}} className="mx-1 border-y-0">
                <CarouselContent>
                    {allOccasions.map((occasion) => <>
                        {occasion.subOccasions.map((subOccasion) => <>
                            <CarouselItem className={smallCardBasises} key={subOccasion._id}>
                                <Link href="/search" className="block h-full mx-1 my-2">
                                    <Card className="rounded-t-[100vw] pt-6 aspect-3/4 overflow-hidden relative">
                                        <picture className="absolute inset-0 w-full h-full opacity-25">
                                            <img
                                                className="w-full h-full object-cover"
                                                src="https://placehold.co/300x400?text=Thumbnail"
                                                alt=""
                                            ></img>
                                        </picture>
                                        <CardHeader className="h-full flex items-center justify-center">
                                            <h3 className="text-2xl font-heading line-clamp-2">
                                                {subOccasion.name}
                                            </h3>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        </>)}
                    </>)}
                </CarouselContent>
                <CarouselPrevious className="border-y -translate-x-1" />
                <CarouselNext className="border-y translate-x-1" />
            </Carousel>
        </div>
        <div className="mb-20">

        </div>
    </>
}