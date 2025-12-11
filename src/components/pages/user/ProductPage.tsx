"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Heart, Share2, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft } from "lucide-react";
import ProductService from "@/lib/api/ProductService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OccasionService from "@/lib/api/OccasionService";
import { Occasion, SubOccasion } from "@/models/occasion";
import { CartItem } from "@/models/cart";

export default function ProductPage() {
    const router = useRouter();
    const { occasion, suboccasion, id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [isFavorite, setIsFavorite] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                // Validate input
                if (!id || !suboccasion || Array.isArray(suboccasion)) {
                    setProduct(null);
                    return;
                }

                const res = await ProductService.fromId(id as string);
                const occasionRes = await OccasionService.fromId(occasion as string);

                // Kiểm tra dữ liệu cơ bản
                if (!res.data || !res.data.subOccasionId || !res.data.subOccasionId.name) {
                    setProduct(null);
                    return;
                }

                // Lấy danh sách subOccasions từ occasion
                const occasionSubOccasions = occasionRes.data?.subOccasions || [];

                // Tìm subOccasion phù hợp
                const foundSubOccasion = occasionSubOccasions.find(
                    (subOcc: SubOccasion) => subOcc.name.toLowerCase() === suboccasion.toLowerCase()
                );

                // Kiểm tra điều kiện
                const isNameMatch = res.data.subOccasionId.name.toLowerCase() === suboccasion.toLowerCase();
                const isValid = isNameMatch && !!foundSubOccasion;

                if (!isValid) {
                    setProduct(null);
                } else {
                    setProduct(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, suboccasion, occasion]);
    const nextImage = () => {
        if (!product?.images) return;
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        if (!product?.images) return;
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const existingIndex = cart.findIndex(
            (item: CartItem) => item.id === product.id
        );

        if (existingIndex !== -1) {

            cart[existingIndex].quantity += quantity;
        } else {

            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                quantity: quantity,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        setQuantity(1);
        toast.success("Đã thêm vào giỏ hàng 🛒", {
            description: product.name,
        });
        window.dispatchEvent(new Event("cartUpdated"));
    };



    const images = product?.images?.map((img: string) => `http://54.254.156.167:8080${img}`) || [];

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="flex items-center gap-2 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Skeleton className="h-6 w-40" />
                </div>
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="lg:w-1/2 space-y-4">
                        <Skeleton className="h-[400px] w-full rounded-xl" />
                        <div className="flex gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-16 w-16 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <Card className="max-w-md mx-auto">
                    <CardContent className="pt-6">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                        <Button onClick={() => router.back()}>
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:py-12">
            {/* Back Button & Breadcrumb */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <nav className="text-sm text-muted-foreground">
                        <ol className="flex items-center space-x-2">
                            <li>Home</li>
                            <li>›</li>
                            <li>{product.subOccasionId?.name || "Category"}</li>
                            <li>›</li>
                            <li className="font-medium text-foreground">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Product Images Section */}
                <div className="lg:w-1/2">
                    <div className="space-y-4">
                        {/* Main Image Container */}
                        <Card className="relative overflow-hidden">
                            <CardContent className="p-0">
                                <div
                                    className="relative bg-muted rounded-lg overflow-hidden aspect-square cursor-zoom-in"
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => setIsZoomed(false)}
                                    onClick={() => setIsZoomed(!isZoomed)}
                                >
                                    <img
                                        src={images[currentImageIndex]}
                                        alt={product.name}
                                        className={cn(
                                            "w-full h-full object-contain transition-transform duration-300",
                                            isZoomed ? "scale-110" : "scale-100"
                                        )}
                                    />

                                    {/* Navigation Controls */}
                                    {images.length > 1 && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    prevImage();
                                                }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    nextImage();
                                                }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm text-foreground text-sm px-3 py-1 rounded-full">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>
                                    )}

                                    {/* Favorite Button */}
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsFavorite(!isFavorite);
                                        }}
                                        className="absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg"
                                    >
                                        <Heart className={cn(
                                            "h-5 w-5",
                                            isFavorite && "fill-red-500 text-red-500"
                                        )} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center mt-3">
                                {images.map((img: string, idx: number) => (
                                    <Button
                                        key={idx}
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={cn(
                                            "h-16 w-16 flex-shrink-0 p-0  rounded-lg ",
                                            currentImageIndex === idx && "ring-2 ring-primary ring-offset-2"
                                        )}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </Button>
                                ))}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleShare}
                        >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share this product
                        </Button>
                    </div>
                </div>

                <div className="lg:w-1/2 space-y-6">
                    <div className="space-y-4">
                        {product.subOccasionId?.name && (
                            <Badge variant="secondary">
                                {product.subOccasionId.name}
                            </Badge>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                In Stock
                            </Badge>
                            <Separator orientation="vertical" className="h-6" />
                            <div className="text-sm text-muted-foreground">
                                {product.stock || 128} units available
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl font-bold">${product.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Free shipping on orders over $50
                            </p>
                        </CardContent>
                    </Card>

                    {product.options && product.options.length > 0 && (
                        <div className="space-y-4">
                            {product.options.map((opt: any) => (
                                <div key={opt.id} className="space-y-3">
                                    <Label className="text-base font-medium">{opt.name}</Label>
                                    <RadioGroup
                                        value={selectedOptions[opt.id]}
                                        onValueChange={(value) => setSelectedOptions(prev => ({
                                            ...prev,
                                            [opt.id]: value
                                        }))}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {opt.values.map((val: string, idx: number) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <RadioGroupItem value={val} id={`${opt.id}-${idx}`} />
                                                <Label
                                                    htmlFor={`${opt.id}-${idx}`}
                                                    className="cursor-pointer"
                                                >
                                                    {val}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label className="text-base font-medium">Quantity</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={decrementQuantity}
                                    className="h-12 w-12 rounded-r-none"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="h-12 w-20 flex items-center justify-center border-x">
                                    <span className="text-lg font-medium">{quantity}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={incrementQuantity}
                                    className="h-12 w-12 rounded-l-none"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            size="lg"
                            className="flex-1 h-14 text-lg gap-2"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 h-14 text-lg"
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t">
                        <Card className="border-0 bg-muted/50">
                            <CardContent className="p-4 text-center">
                                <Truck className="h-8 w-8 text-primary mb-2 mx-auto" />
                                <p className="text-sm font-medium">Free Shipping</p>
                                <p className="text-xs text-muted-foreground">Over $50</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-muted/50">
                            <CardContent className="p-4 text-center">
                                <RotateCcw className="h-8 w-8 text-primary mb-2 mx-auto" />
                                <p className="text-sm font-medium">30-Day Return</p>
                                <p className="text-xs text-muted-foreground">Easy returns</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-muted/50">
                            <CardContent className="p-4 text-center">
                                <Shield className="h-8 w-8 text-primary mb-2 mx-auto" />
                                <p className="text-sm font-medium">2-Year Warranty</p>
                                <p className="text-xs text-muted-foreground">Guaranteed</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 bg-muted/50">
                            <CardContent className="p-4 text-center">
                                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                                    <span className="text-primary font-bold text-sm">24/7</span>
                                </div>
                                <p className="text-sm font-medium">Support</p>
                                <p className="text-xs text-muted-foreground">Always online</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="description" className="pt-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="specifications">Specifications</TabsTrigger>
                        </TabsList>
                        <TabsContent value="description" className="pt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-muted-foreground leading-relaxed">
                                        {product.description || "No description available."}
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="specifications" className="pt-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">SKU</span>
                                            <span className="font-medium">{product.id?.slice(0, 8) || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Category</span>
                                            <span className="font-medium">{product.subOccasionId?.name || "Uncategorized"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Tags</span>
                                            <span className="font-medium">{product.tags?.join(", ") || "No tags"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
