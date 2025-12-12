"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductService from "@/lib/api/ProductService";
import OccasionService from "@/lib/api/OccasionService";
import { SubOccasion } from "@/models/occasion";
import { CartItem } from "@/models/cart";

// Import components
import ProductImages from "@/components/blocks/product/ProductImages";
import ProductInfo from "@/components/blocks/product/ProductInfo";
import ProductOptions from "@/components/blocks/product/ProductOptions";
import QuantitySelector from "@/components/blocks/product/QuantitySelector";
import ActionButtons from "@/components/blocks/product/ActionButtons";
import ProductFeatures from "@/components/blocks/product/ProductFeatures";
import ProductTabs from "@/components/blocks/product/ProductTabs";
import LoadingSkeleton from "@/components/blocks/product/LoadingSkeleton";
import ProductNotFound from "@/components/blocks/product/ProductNotFound";

// Import UI components
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProductPage() {
  const router = useRouter();
  const { occasion, suboccasion, id } = useParams();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isFavorite, setIsFavorite] = useState(false);

useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                if (!id || !suboccasion || Array.isArray(suboccasion)) {
                    setProduct(null);
                    return;
                }
                const res = await ProductService.fromId(id as string);

        
                const encodedOccasion = encodeURIComponent(occasion as string);
                const occasionRes = await OccasionService.fromId(encodedOccasion);

                if (!res.data || !res.data.subOccasionId || !res.data.subOccasionId.name) {
                    setProduct(null);
                    return;
                }

                const occasionSubOccasions = occasionRes.data?.subOccasions || [];
                console.log(occasionRes);

                const decodedSuboccasion = decodeURIComponent(suboccasion as string);

                const foundSubOccasion = occasionSubOccasions.find(
                    (subOcc: any) => subOcc.name.toLowerCase() === decodedSuboccasion.toLowerCase()
                );

                const isNameMatch = res.data.subOccasionId.name.toLowerCase() === decodedSuboccasion.toLowerCase();
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
      toast.info('Link copied to clipboard!', {
        description: 'Product link has been copied.',
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

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
        suboccasion: {
          id: product.subOccasionId?.id,
          name: product.subOccasionId?.name,
          occasionId: product.subOccasionId?.occasionId,
        },
        
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(1);
    
    toast.success("Added to cart", {
      description: `${product.name} x${quantity}`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    });
    
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const images = product?.images?.map((img: string) => 
    `http://54.254.156.167:8080${img}`
  ) || [];

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:py-12 max-w-7xl">
      {/* Back Button & Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-lg border-2 hover:border-primary hover:bg-primary/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <nav className="text-sm text-muted-foreground">
            <ol className="flex items-center space-x-2">
              <li className="hover:text-primary cursor-pointer transition-colors">
                Home
              </li>
              <li>›</li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {product.subOccasionId?.occasionId?.name || "Products"}
              </li>
              <li>›</li>
              <li className="hover:text-primary cursor-pointer transition-colors">
                {product.subOccasionId?.name || "Category"}
              </li>
              <li>›</li>
              <li className="font-semibold text-foreground">
                {product.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column - Product Images */}
        <ProductImages
          images={images}
          productName={product.name}
          isFavorite={isFavorite}
          onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          onShare={handleShare}
        />

        {/* Right Column - Product Details */}
        <div className="lg:w-1/2 space-y-8">
          <ProductInfo
            name={product.name}
            category={product.subOccasionId?.name}
            price={product.price}
            stock={product.stock || 128}
            description={product.description}
          />

          {/* Product Options */}
          {product.options && product.options.length > 0 && (
            <ProductOptions
              options={product.options}
              selectedOptions={selectedOptions}
              onOptionChange={(optionId, value) =>
                setSelectedOptions(prev => ({ ...prev, [optionId]: value }))
              }
            />
          )}

          {/* Quantity Selector */}
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => setQuantity(prev => prev + 1)}
            onDecrement={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
            max={product.stock || 99}
          />

          {/* Action Buttons */}
          <ActionButtons
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />

          {/* Features Grid */}
          <ProductFeatures />

          {/* Tabs */}
          <ProductTabs
            description={product.description}
            productId={product.id}
            category={product.subOccasionId?.name}
            tags={product.tags}
          />
        </div>
      </div>
    </div>
  );
}