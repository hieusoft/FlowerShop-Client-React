"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ArrowRight,
    Star,
    Sparkles,
    Shield,
    Truck,
    Clock,
    CheckCircle,
    Gift,
    Award,
    Flower,
    Heart,
    Search,
    Filter,
    ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/blocks/product/product-card";
import ProductService from "@/lib/api/ProductService";
import OccasionService from "@/lib/api/OccasionService";

export default function HomePage() {
    const router = useRouter();
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [newArrivals, setNewArrivals] = useState<any[]>([]);
    const [bestSellers, setBestSellers] = useState<any[]>([]);
    const [subOccasions, setSubOccasions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const services = [
        {
            icon: Truck,
            title: "Same Day Delivery",
            description: "Order by 2PM for same day delivery"
        },
        {
            icon: Clock,
            title: "Free Shipping",
            description: "On orders over $50"
        },
        {
            icon: Shield,
            title: "Fresh Guarantee",
            description: "7-day freshness guarantee"
        },
        {
            icon: Gift,
            title: "Free Gift Card",
            description: "With every order"
        },
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            review: "Beautiful flowers arrived fresh and exactly as pictured. My mother loved them!",
            rating: 5
        },
        {
            name: "Michael Chen",
            review: "Excellent service and the bouquet was stunning. Will definitely order again.",
            rating: 5
        },
        {
            name: "Emma Wilson",
            review: "Perfect for our anniversary. The flowers lasted over two weeks!",
            rating: 5
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [featuredRes, newRes, bestSellersRes, occasionsRes] = await Promise.all([
                    ProductService.list({
                        page: 1,
                        limit: 10,
                        sortOption: "newest"
                    }),
                    ProductService.list({
                        page: 1,
                        limit: 10,
                        sortOption: "newest"
                    }),
                    ProductService.list({
                        page: 1,
                        limit: 10,
                        sortOption: "priceDesc"
                    }),
                    OccasionService.list()
                ]);

                const rawFeatured = featuredRes.data.data;
                const rawNew = newRes.data.data;
                const rawBestSellers = bestSellersRes.data.data;

                const allProducts = [...rawFeatured, ...rawNew, ...rawBestSellers];
                const occasionIds = [...new Set(
                    allProducts
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

                const enrichProducts = (products: any[]) => {
                    return products.map((product: any) => {
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
                };

                setFeaturedProducts(enrichProducts(rawFeatured));
                setNewArrivals(enrichProducts(rawNew));
                setBestSellers(enrichProducts(rawBestSellers));

                const allSubOccasions: any[] = [];
                (occasionsRes.data || []).forEach((occ: any) => {
                    if (occ.subOccasions && Array.isArray(occ.subOccasions)) {
                        occ.subOccasions.forEach((sub: any) => {
                            allSubOccasions.push({
                                ...sub,
                                occasionName: occ.name
                            });
                        });
                    }
                });
                setSubOccasions(allSubOccasions);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="relative h-[400px] bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl">
                            <Skeleton className="h-12 w-96 mb-4" />
                            <Skeleton className="h-6 w-64 mb-8" />
                            <Skeleton className="h-12 w-40" />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-lg" />
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <Skeleton key={i} className="h-64 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4 bg-green-600 text-white hover:bg-green-700">
                            <Sparkles className="w-4 h-4 mr-2" />
                            #1 Flower Delivery Service
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Send Flowers & Gifts Worldwide
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Same day flower delivery to over 100 countries. Fresh flowers guaranteed.
                        </p>

                        <div className="relative max-w-2xl mx-auto mb-8">
                            <form onSubmit={handleSearch}>
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search for flowers, bouquets, or occasions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 py-6 text-lg border-2 border-green-200 focus:border-green-500 rounded-full"
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 rounded-full px-6"
                                >
                                    Search
                                </Button>
                            </form>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {subOccasions.slice(0, 5).map((subOcc: any) => (
                                <Link key={subOcc.id} href={`/shop/${subOcc.occasionName}/${subOcc.name}`}>
                                    <Badge variant="outline" className="px-4 py-2 text-sm hover:bg-green-50 cursor-pointer">
                                        {subOcc.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {services.map((service, index) => (
                            <div key={index} className="flex items-center space-x-3 p-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <service.icon className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 ">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop By Category</h2>
                            <p className="text-gray-600">Perfect flowers for every special moment</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {subOccasions.slice(0, 12).map((subOcc: any) => (
                            <Link
                                key={subOcc.id}
                                href={`/shop/${subOcc.occasionName}/${subOcc.name}`}
                                className="group"
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                            <Flower className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-900 group-hover:text-green-600 text-sm">
                                            {subOcc.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">{subOcc.occasionName}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
                            </div>
                            <p className="text-gray-600">Most popular flower arrangements</p>
                        </div>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Flower className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Featured Products</h3>
                            <p className="text-gray-600">Check back soon for new arrivals!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {featuredProducts.slice(0, 10).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    occasion={product.subOccasionId?.occasionId?.name || "all"}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">New Arrivals</h2>
                            </div>
                            <p className="text-gray-600">Fresh designs just added</p>
                        </div>
                    </div>

                    {newArrivals.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Sparkles className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No New Arrivals</h3>
                            <p className="text-gray-600">Check back soon for new designs!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {newArrivals.slice(0, 10).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    occasion={product.subOccasionId?.occasionId?.name || "all"}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-orange-500" />
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Best Sellers</h2>
                            </div>
                            <p className="text-gray-600">Customer favorites</p>
                        </div>
                    </div>

                    {bestSellers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <Award className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Best Sellers</h3>
                            <p className="text-gray-600">Check back soon for popular items!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {bestSellers.slice(0, 10).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    occasion={product.subOccasionId?.occasionId?.name || "all"}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-gray-600">Thousands of satisfied customers worldwide</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                            <span className="font-semibold text-green-600">
                                                {testimonial.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-gray-600">Verified Customer</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-gradient-to-r from-green-600 to-emerald-600">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Send Beautiful Flowers?
                        </h2>
                        <p className="text-white/90 text-lg mb-8">
                            Order now and get same day delivery. Fresh flowers guaranteed or your money back.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/search">
                                <Button size="lg" className="bg-white text-green-600 hover:bg-white/90">
                                    Shop Now
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/80 text-sm">
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                7-Day Freshness Guarantee
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Free Shipping Over $50
                            </div>
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                24/7 Customer Support
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}