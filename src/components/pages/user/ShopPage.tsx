"use client";
import { ProductCard } from "@/components/blocks/product/product-card";
import { FieldGroup, FieldSet, FieldLegend, Field, FieldSeparator, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import ProductService from "@/lib/ProductService";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ShopPage() {

    const { occasion, suboccasion } = useParams();

    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [priceRange, setPriceRange] = useState<[number, number]>([20, 1000]); // state cho slider
    const limit = 12;

    const fetchProducts = async (pageNumber: number) => {
        const res = await ProductService.GetAllProducts({
            page: pageNumber,
            limit: limit,
            minPrice: priceRange[0], // filter theo giá
            maxPrice: priceRange[1],
            // subOccasionId: suboccasion,
        });

        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page, suboccasion, priceRange]);

    return (
        <div className="container mx-auto flex flex-col lg:flex-row mb-20 gap-4">

            <form className="lg:basis-1/3 xl:basis-1/4 shrink-0 px-8 lg:pr-4">
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Sort by</FieldLegend>
                        <Field>
                            <Input placeholder="Search..." />
                        </Field>
                    </FieldSet>

                    <FieldSeparator />

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
                {products.length === 0 ? (
                    <p>No products found.</p>
                ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
                        {products.map((product, index) => (
                            <ProductCard key={index} product={product} />
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
