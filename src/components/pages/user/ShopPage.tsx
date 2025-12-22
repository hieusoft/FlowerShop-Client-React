"use client";
import { ProductCard } from "@/components/blocks/product/product-card";
import { FieldGroup, FieldSet, FieldLegend, Field, FieldSeparator, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink
} from "@/components/ui/pagination";
import ProductService from "@/lib/api/ProductService";
import OccasionService from "@/lib/api/OccasionService";

export default function ShopPage() {
    const { occasion, suboccasion } = useParams();
    const router = useRouter();

    const [bouquets, setBouquets] = useState<any[]>([]);
    const [occasionData, setOccasionData] = useState<any>(null);
    const [currentSuboccasion, setCurrentSuboccasion] = useState<any>(null);
    const [isSuboccasionValid, setIsSuboccasionValid] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [priceRange, setPriceRange] = useState<[number, number]>([20, 1000]);
    const [sortBy, setSortBy] = useState<string>("newest");
    const [loading, setLoading] = useState(true);
    const limit = 12;

    const sortOptions = [
        { value: "newest", label: "Newest Arrivals" },
        { value: "oldest", label: "Oldest Arrivals" },
        { value: "price_asc", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
        { value: "name_asc", label: "Name: A to Z" },
        { value: "name_desc", label: "Name: Z to A" },
    ];

    const mapSortOption = (sortBy: string): string => {
        switch (sortBy) {
            case "newest": return "newest";
            case "oldest": return "oldest";
            case "price_asc": return "priceAsc";
            case "price_desc": return "priceDesc";
            case "name_asc": return "nameAsc";
            case "name_desc": return "nameDesc";
            default: return "newest";
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const encodedOccasion = encodeURIComponent(occasion as string);
                const res = await OccasionService.fromId(encodedOccasion);
                const data = res.data;
                
                if (!data) {
                    setOccasionData(null);
                    setIsSuboccasionValid(false);
                    return;
                }
                setOccasionData(data);

                if (suboccasion && data.subOccasions) {
                    const decodedSuboccasion = decodeURIComponent(suboccasion as string);

                    const foundSuboccasion = data.subOccasions.find(
                        (sub: any) => sub.name.toLowerCase() === decodedSuboccasion.toLowerCase()
                    );
                    
                    if (foundSuboccasion) {
                        setIsSuboccasionValid(true);
                        setCurrentSuboccasion(foundSuboccasion); 
                    } else {
                        setIsSuboccasionValid(false);
                        setCurrentSuboccasion(null);
                    }
                } else {
                    setIsSuboccasionValid(true);
                    setCurrentSuboccasion(null);
                }
            } catch (error) {
                console.error(error);
                setOccasionData(null);
                setIsSuboccasionValid(false);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [occasion, suboccasion, router]);


    useEffect(() => {
        if (occasionData && !isSuboccasionValid) {
            setBouquets([]);
        }
    }, [occasionData, isSuboccasionValid]);

    const fetchBouquets = async (pageNumber: number) => {
        if (!occasionData || !isSuboccasionValid) return;

        try {
            const res = await ProductService.list({
                page: pageNumber,
                limit,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                subOccasionName: suboccasion as string,
                sortOption: mapSortOption(sortBy),
            });
            setBouquets(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotalItems(res.data.totalItems);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBouquets(page);
    }, [page, priceRange, sortBy, occasionData, isSuboccasionValid]);

    const getDisplayInfo = () => {
        if (currentSuboccasion) {
            return {
                title: currentSuboccasion.name,
                description: currentSuboccasion.description || "Browse our collection"
            };
        } else if (occasionData) {
            return {
                title: occasionData.name,
                description: occasionData.description || "Browse our collection"
            };
        }
        return {
            title: "Shop",
            description: "Browse our collection"
        };
    };

    const displayInfo = getDisplayInfo();

    if (loading) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!occasionData || !isSuboccasionValid) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <Card className="max-w-md mx-auto">
                    <CardContent className="pt-6">
                        <div className="text-6xl mb-4">404</div>
                        <h2 className="text-2xl font-bold mb-2">Category Not Found</h2>
                        <p className="text-gray-600 mb-6">
                            {!occasionData 
                                ? "The category you're looking for doesn't exist."
                                : "The sub-category you're looking for doesn't exist in this category."
                            }
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={() => router.push('/')}>
                                Go to Homepage
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => router.back()}
                            >
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto flex flex-col lg:flex-row mb-20 gap-4">
            <form className="lg:basis-1/3 xl:basis-1/4 shrink-0 px-8 lg:pr-4">
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Sort by</FieldLegend>
                        <Field>
                            <RadioGroup value={sortBy} onValueChange={setSortBy} className="space-y-2">
                                {sortOptions.map(option => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option.value} id={option.value} />
                                        <FieldLabel htmlFor={option.value} className="cursor-pointer font-normal">
                                            {option.label}
                                        </FieldLabel>
                                    </div>
                                ))}
                            </RadioGroup>
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <FieldLegend>Filters</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Price Range</FieldLabel>
                                <p className="text-sm mb-2">${priceRange[0]} - ${priceRange[1]}</p>
                                <Slider
                                    value={priceRange}
                                    max={1000}
                                    min={0}
                                    step={1}
                                    className={cn("w-[60%]")}
                                    onValueChange={(value: [number, number]) => setPriceRange(value)}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                </FieldGroup>
            </form>

            <section className="flex-1 px-8 lg:pl-4">
                <div className="mb-6">
                    <div className="space-y-2">
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                            {displayInfo.title}
                        </h3>
                        <p className="text-gray-600">{displayInfo.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span className="font-semibold text-gray-800">
                                {sortOptions.find(opt => opt.value === sortBy)?.label}
                            </span>
                            <span>-</span>
                            <span>{totalItems} {totalItems > 1 ? "Bouquets" : "Bouquet"}</span>
                            <span>(page {page} of {totalPages})</span>
                        </div>
                    </div>
                </div>

                {bouquets.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">No bouquets found in this category.</p>
                        <Button 
                            variant="outline" 
                            onClick={() => router.push('/')}
                        >
                            Browse Other Categories
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                            {bouquets.map((bouquet) => (
                                <ProductCard
                                    key={bouquet.id}
                                    product={bouquet}
                                    occasion={occasion as string}
                                />
                            ))}
                        </div>

                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => page > 1 && setPage(page - 1)}
                                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNumber = index + 1;
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                isActive={page === pageNumber}
                                                onClick={() => setPage(pageNumber)}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => page < totalPages && setPage(page + 1)}
                                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </>
                )}
            </section>
        </div>
    );
}