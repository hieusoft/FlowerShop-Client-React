"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardThumbnail,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Hero, HeroContent, HeroMedia } from "@/components/ui/hero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import PaymentService from "@/lib/api/PaymentService";
import { useEffect } from "react";
import GreetingService from "@/lib/api/GreetingService";

export default function TestPage({ }) {
  const cardBasises = "md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5";
  useEffect(() => {
    const fetchPayments = async () => {
      const res = await GreetingService.list();
      console.log(res.data);
    };

    fetchPayments();
  }, []);

  return (
    <>
      <Hero>
        <HeroContent>
          <h1 className="font-heading text-6xl">
            Very big header at the start of the page
          </h1>
          <p className="flex gap-1">Here are some descriptions</p>
          <p className="flex flex-wrap gap-1">
            <Button>Primary</Button>
            <Button variant={"secondary"}>Secondary</Button>
            <Button variant={"outline"}>Outline</Button>
            <Button variant={"destructive"}>Destructive</Button>
            <Button variant={"ghost"}>Ghost</Button>
          </p>
        </HeroContent>
        <HeroMedia>
          <picture className="w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="https://placehold.co/500x500"
              alt=""
            ></img>
          </picture>
        </HeroMedia>
      </Hero>
      <section className="my-10">
        <h2 className="container mx-auto px-8 font-heading text-4xl">
          Our top picks
        </h2>
        <Carousel className="mx-auto my-4 border-y" opts={{ align: "start" }}>
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem className={cardBasises} key={index}>
                <div className="h-full">
                  <Card className="h-full border-0 border-x -ml-px rounded-none">
                    <CardThumbnail>
                      <picture className="w-full h-full">
                        <img
                          className="w-full h-full object-cover"
                          src="https://placehold.co/500x500"
                          alt=""
                        ></img>
                      </picture>
                    </CardThumbnail>
                    <CardHeader>
                      <h3 className="text-2xl font-heading">
                        Bouquet #{index + 1}
                      </h3>
                    </CardHeader>
                    <CardDescription>
                      Here lies some description for the bouquet...
                    </CardDescription>
                  </Card>
                </div>
              </CarouselItem>
            ))}
            <CarouselItem className={cardBasises}>
              <div className="h-full">
                <Card className="h-full border-0 border-x -ml-px rounded-none flex items-center justify-center">
                  <h3 className="text-2xl font-heading">
                    View more bouquets...
                  </h3>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
      <div className="container mx-auto flex flex-col lg:flex-row mb-20 gap-4">
        <form className="lg:basis-1/3 xl:basis-1/4 shrink-0 px-8 lg:pr-4">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Sort by</FieldLegend>
              <Field>
                <Select defaultValue="popular">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most popular</SelectItem>
                    <SelectItem value="cheap">Most affordable</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="alphabet">Alphabetically</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLegend>Filters</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="filter-search">
                    Search
                  </FieldLabel>
                  <Input
                    id="filter-search"
                    placeholder="Search by name or description..."
                  />
                </Field>
                <Field>
                  <FieldLabel>Mood</FieldLabel>
                  <RadioGroup className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="light" id="r1" />
                      <Label htmlFor="r1">Light</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="cheerful" id="r2" />
                      <Label htmlFor="r2">Cheerful</Label>
                    </div>
                  </RadioGroup>
                </Field>
                <Field>
                  <FieldLabel>Price Range</FieldLabel>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Min" className="w-1/2" />
                    <Input type="number" placeholder="Max" className="w-1/2" />
                  </div>
                </Field>
                <Field>
                  <FieldLabel>Availability</FieldLabel>
                  <Field orientation="horizontal">
                    <Checkbox id="in-stock" />
                    <Label htmlFor="in-stock">In Stock</Label>
                  </Field>
                </Field>
                <Field>
                  <FieldLabel>Occasion</FieldLabel>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
        <section className="flex-1 px-8 lg:pl-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} className="rounded-md">
                <CardThumbnail>
                  <picture className="w-full h-full">
                    <img
                      className="w-full h-full object-cover"
                      src="https://placehold.co/500x500"
                      alt=""
                    ></img>
                  </picture>
                </CardThumbnail>
                <CardHeader>
                  <h3 className="text-2xl font-heading">
                    Bouquet #{index + 1}
                  </h3>
                </CardHeader>
                <CardDescription>
                  Here lies some description for the bouquet...
                </CardDescription>
              </Card>
            ))}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </div>
    </>
  );
}
