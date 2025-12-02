import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardThumbnail } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Hero, HeroContent } from "@/components/ui/hero";

export default function Page({}) {
    return <>
        <Hero>
            <HeroContent>
                <h1 className="font-header text-6xl">Very big header at the start of the page</h1>
                <p className="flex gap-1">
                    Here are some descriptions
                </p>
                <p className="flex flex-wrap gap-1">
                    <Button>Primary</Button>
                    <Button variant={"secondary"}>Secondary</Button>
                    <Button variant={"outline"}>Outline</Button>
                    <Button variant={"destructive"}>Destructive</Button>
                    <Button variant={"ghost"}>Ghost</Button>
                </p>
            </HeroContent>
        </Hero>
        <section className="my-10">
            <h2 className="container mx-auto px-8 font-header text-4xl">Our top picks</h2>
            <Carousel className="mx-auto my-4 border-y">
                <CarouselContent>
                    {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem className="basis-1/5" key={index}>
                        <div className="h-full">
                            <Card className="h-full border-0 border-x -ml-px rounded-none">
                                <CardThumbnail>
                                    <picture className="w-full h-full">
                                        <img className="w-full h-full object-cover" src="https://placehold.co/500x500" alt=""></img>
                                    </picture>
                                </CardThumbnail>
                                <CardHeader>
                                    <h3 className="text-2xl font-header">Bouquet #{index + 1}</h3>
                                </CardHeader>
                            </Card>
                        </div>
                    </CarouselItem>
                    ))}
                    <CarouselItem className="basis-1/5">
                        <div className="h-full">
                            <Card className="h-full border-0 border-x -ml-px rounded-none flex items-center justify-center">
                                <h3 className="text-2xl font-header">View more bouquets...</h3>
                            </Card>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    </>;
}