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
import ProductService from "@/lib/ProductService";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductPage() {

    const { id } = useParams();

    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 12;


    const fetchProducts = async (pageNumber: number) => {
        const res = await ProductService.GetAllProducts({
            page: pageNumber,
            limit: limit,
            subOccasionId: id,
        });

        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
    };

    useEffect(() => {
        fetchProducts(page);
    }, [page, id]);

    return (
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
                                <FieldLabel>Search</FieldLabel>
                                <Input placeholder="Search..." />
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
                                <div className="flex items-center gap-2">
                                    <Checkbox id="in-stock" />
                                    <Label htmlFor="in-stock">In Stock</Label>
                                </div>
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
