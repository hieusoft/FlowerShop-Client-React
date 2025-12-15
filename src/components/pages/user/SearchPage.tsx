"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductCard } from "@/components/blocks/product/product-card";
import ProductService from "@/lib/api/ProductService";
import OccasionService from "@/lib/api/OccasionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { FieldGroup, FieldSet, FieldLegend, Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryParam = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(queryParam);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [sortBy, setSortBy] = useState("newest");
    const [priceRange, setPriceRange] = useState<[number, number]>([20, 1000]);

    const limit = 16;

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "priceAsc", label: "Price: Low to High" },
        { value: "priceDesc", label: "Price: High to Low" },
        { value: "nameAsc", label: "Name: A to Z" },
        { value: "nameDesc", label: "Name: Z to A" },
    ];

    useEffect(() => {
        setSearchQuery(queryParam);
        if (queryParam) {
            performSearch(queryParam, 1);
        }
    }, [queryParam]);

    useEffect(() => {
        if (searchQuery) {
            performSearch(searchQuery, page);
        }
    }, [page, sortBy, priceRange]);

    const performSearch = async (query: string, pageNum: number) => {
        if (!query.trim()) {
            setProducts([]);
            return;
        }

        try {
            setLoading(true);

            const params: any = {
                page: pageNum,
                limit,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                sortOption: sortBy,
                search_query: query.trim(),
            };


            const res = await ProductService.list(params);
            const rawProducts = res.data.data;

            const occasionIds = [...new Set(
                rawProducts
                    .map((p: any) => p.subOccasionId?.occasionId)
                    .filter(Boolean)
            )] as string[];

            const occasionsMap = new Map<string, string>();
            await Promise.all(
                occasionIds.map(async (id: string) => {
                    try {
                        const occRes = await OccasionService.fromId(id);
                        occasionsMap.set(id, occRes.data.name);
                    } catch (error) {
                        console.error(`Failed to fetch occasion ${id}:`, error);
                    }
                })
            );

            const enrichedProducts = rawProducts.map((product: any) => {
                const occasionId = product.subOccasionId?.occasionId;
                const occasionName = occasionsMap.get(occasionId);

                if (!occasionName) return null;

                return {
                    ...product,
                    subOccasionId: {
                        ...product.subOccasionId,
                        occasionId: {
                            id: occasionId,
                            name: occasionName
                        }
                    }
                };
            }).filter(Boolean);

            setProducts(enrichedProducts);
            setTotalPages(res.data.totalPages);
            setTotalItems(res.data.totalItems);
        } catch (error) {
            console.error("Search error:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mx-auto flex flex-col lg:flex-row mb-20 gap-4">

            {/* ===== LEFT SIDEBAR ===== */}
            <form className="lg:basis-1/3 xl:basis-1/4 shrink-0 px-8 lg:pr-4">
                <FieldGroup>

                    {/* SORT */}
                    <FieldSet>
                        <FieldLegend>Sort by</FieldLegend>
                        <Field>
                            <RadioGroup
                                value={sortBy}
                                onValueChange={(value) => {
                                    setSortBy(value);
                                    setPage(1);
                                }}
                                className="space-y-2"
                            >
                                {sortOptions.map(option => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option.value} id={option.value} />
                                        <FieldLabel
                                            htmlFor={option.value}
                                            className="cursor-pointer font-normal"
                                        >
                                            {option.label}
                                        </FieldLabel>
                                    </div>
                                ))}
                            </RadioGroup>
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

                    {/* PRICE RANGE */}
                    <FieldSet>
                        <FieldLegend>Filters</FieldLegend>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Price Range</FieldLabel>
                                <p className="text-sm mb-2">
                                    ${priceRange[0]} - ${priceRange[1]}
                                </p>

                                <Slider
                                    value={priceRange}
                                    min={0}
                                    max={1000}
                                    step={1}
                                    className="w-[60%]"
                                    onValueChange={(value: [number, number]) => {
                                        setPriceRange(value);
                                        setPage(1);
                                    }}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                </FieldGroup>
            </form>


            {/* ===== RIGHT CONTENT ===== */}
            <section className="flex-1 px-8 lg:pl-4">

                {/* HEADER */}
                <div className="mb-6 space-y-2">
                    <h3 className="text-2xl font-semibold tracking-tight">
                        Search results for "{queryParam}"
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span className="font-semibold text-gray-800">
                            {sortOptions.find(opt => opt.value === sortBy)?.label}
                        </span>
                        <span>-</span>
                        <span>{totalItems} Products</span>
                        {totalPages > 0 && (
                            <span>(page {page} of {totalPages})</span>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <Card key={i}>
                                <Skeleton className="h-[210px] w-full" />
                                <CardContent className="p-4">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-6 w-20" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 mb-4">
                            No products found.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/")}
                        >
                            Return home
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* PRODUCT GRID */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    occasion={
                                        product.subOccasionId?.occasionId?.name || "all"
                                    }
                                />
                            ))}
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
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
                        )}
                    </>
                )}
            </section>
        </div>
    );

}