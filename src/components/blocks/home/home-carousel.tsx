"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export type HomeCarouselItems = {
    src: string,
    alt: string,
}

export function HomeCarousel(
    { items }: {
        items: Array<HomeCarouselItems>
    }
) {
    return (
        <Carousel opts={{loop: true}} plugins={[Autoplay({delay: 10000})]}>
            <CarouselContent full>
                {items.map((item, index) => (
                    <CarouselItem className="container" key={index}>
                        <picture>
                            <img
                                className="w-full"
                                src={item.src} alt={item.alt} />
                        </picture>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}