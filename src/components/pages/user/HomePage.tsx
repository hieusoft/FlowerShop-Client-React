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
  Search,
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
      description: "Order by 2PM for same day delivery",
    },
    {
      icon: Clock,
      title: "Free Shipping",
      description: "On orders over $50",
    },
    {
      icon: Shield,
      title: "Fresh Guarantee",
      description: "7-day freshness guarantee",
    },
    {
      icon: Gift,
      title: "Free Gift Card",
      description: "With every order",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      review:
        "Beautiful flowers arrived fresh and exactly as pictured. My mother loved them!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      review:
        "Excellent service and the bouquet was stunning. Will definitely order again.",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      review: "Perfect for our anniversary. The flowers lasted over two weeks!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [featuredRes, newRes, bestRes, occasionsRes] =
          await Promise.all([
            ProductService.list({ page: 1, limit: 10, sortOption: "newest" }),
            ProductService.list({ page: 1, limit: 10, sortOption: "newest" }),
            ProductService.list({ page: 1, limit: 10, sortOption: "priceDesc" }),
            OccasionService.list(),
          ]);

        const rawFeatured = featuredRes.data.data;
        const rawNew = newRes.data.data;
        const rawBest = bestRes.data.data;

        const allProducts = [...rawFeatured, ...rawNew, ...rawBest];
        const occasionIds = [
          ...new Set(
            allProducts
              .map((p: any) => p.subOccasionId?.occasionId)
              .filter(Boolean)
          ),
        ];

        const occasionMap = new Map<string, string>();

        await Promise.all(
          occasionIds.map(async (id: string) => {
            const res = await OccasionService.fromId(id);
            occasionMap.set(id, res.data.name);
          })
        );

        const enrichProducts = (products: any[]) =>
          products
            .map((p: any) => {
              const occId = p.subOccasionId?.occasionId;
              const occName = occasionMap.get(occId);
              if (!occName) return null;

              return {
                ...p,
                subOccasionId: {
                  ...p.subOccasionId,
                  occasionId: {
                    id: occId,
                    name: occName,
                  },
                },
              };
            })
            .filter(Boolean);

        setFeaturedProducts(enrichProducts(rawFeatured));
        setNewArrivals(enrichProducts(rawNew));
        setBestSellers(enrichProducts(rawBest));

        const allSub: any[] = [];
        (occasionsRes.data || []).forEach((occ: any) => {
          occ.subOccasions?.forEach((sub: any) => {
            allSub.push({
              ...sub,
              occasionName: occ.name,
            });
          });
        });

        setSubOccasions(allSub);
      } catch (err) {
        console.error(err);
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
      <div className="min-h-screen container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-96 mb-6" />
        <Skeleton className="h-6 w-64 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-green-600 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            #1 Flower Delivery Service
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Send Flowers & Gifts Worldwide
          </h1>

          <p className="text-gray-600 mb-8">
            Same day delivery – Fresh flowers guaranteed
          </p>

          <form
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto mb-6"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flowers, bouquets, occasions..."
              className="pl-12 py-6 rounded-full"
            />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
            >
              Search
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-4">
            {subOccasions.slice(0, 5).map((sub: any) => (
              <Link
                key={`${sub.occasionName}-${sub.name}`}
                href={`/shop/${sub.occasionName}/${sub.name}`}
              >
                <Badge variant="outline" className="px-4 py-2">
                  {sub.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((s) => (
            <div key={s.title} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <s.icon className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS SECTIONS */}
      {[
        {
          title: "Featured Products",
          icon: Star,
          data: featuredProducts,
        },
        {
          title: "New Arrivals",
          icon: Sparkles,
          data: newArrivals,
        },
        {
          title: "Best Sellers",
          icon: Award,
          data: bestSellers,
        },
      ].map((section) => (
        <section key={section.title} className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <section.icon className="text-yellow-500" />
              <h2 className="text-2xl font-bold">{section.title}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {section.data.slice(0, 10).map((product: any, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  occasion={
                    product.subOccasionId?.occasionId?.name || "all"
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* TESTIMONIALS */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="italic mb-4">"{t.review}"</p>
                <p className="font-semibold">{t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-green-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Send Beautiful Flowers?
        </h2>
        <Link href="/search">
          <Button size="lg" className="bg-white text-green-600">
            Shop Now <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
