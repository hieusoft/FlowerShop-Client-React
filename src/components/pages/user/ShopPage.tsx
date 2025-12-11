"use client";

import { ProductCard } from "@/components/blocks/product/product-card";
import { FieldGroup, FieldSet, FieldLegend, Field, FieldSeparator, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProductService from "@/lib/api/ProductService";
import OccasionService from "@/lib/api/OccasionService";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext
} from "@/components/ui/pagination";

export default function ShopPage() {
    const { occasion, suboccasion } = useParams();

    const [bouquets, setBouquets] = useState<any[]>([]);
    const [occasionData, setOccasionData] = useState<any>(null);
    const [isSuboccasionValid, setIsSuboccasionValid] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [priceRange, setPriceRange] = useState<[number, number]>([20, 1000]);
    const [sortBy, setSortBy] = useState<string>("newest");
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

    // Ref để debounce slider
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await OccasionService.fromId(occasion as string);
                const data = res.data;

                if (!data) {
                    setBouquets([]);
                    return;
                }

                setOccasionData(data);

                if (suboccasion && Array.isArray(data.subOccasions)) {
                    const valid = data.subOccasions.some((sub: any) => sub.name === suboccasion);
                    setIsSuboccasionValid(valid);
                } else {
                    setIsSuboccasionValid(true);
                }
            } catch (error) {
                console.error(error);
                setBouquets([]);
            }
        };
        fetchData();
    }, [occasion, suboccasion]);

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
                subOccasionName: suboccasion,
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
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchBouquets(page);
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [page, priceRange, sortBy, occasionData, isSuboccasionValid]);

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
                            {occasionData?.name || "Shop"}
                        </h3>
                        <p className="text-gray-600">{occasionData?.description || "Browse our collection"}</p>
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
                    <p className="text-center py-10 text-gray-500">No bouquets found.</p>
                ) : (
                    <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                        {bouquets.map((bouquet) => (
                            <ProductCard
                                key={bouquet.id || bouquet.product_id}
                                product={bouquet}
                                occasion={occasion as string}
                            />
                        ))}
                    </div>
                )}

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
            </section>
        </div>
    );
}
