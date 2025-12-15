"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  productName: string;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onShare: () => void;
}

export default function ProductImages({
  images,
  productName,
  isFavorite,
  onFavoriteToggle,
  onShare,
}: ProductImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="lg:w-1/2 space-y-4">
      {/* Main Image Container */}
      <Card className="relative overflow-hidden group">
        <CardContent className="p-0">
          <div
            className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl overflow-hidden aspect-square cursor-zoom-in transition-all duration-300 hover:shadow-xl"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <img
              src={images[currentImageIndex]}
              alt={productName}
              className={cn(
                "w-full h-full object-contain transition-all duration-500",
                isZoomed ? "scale-110" : "scale-100 group-hover:scale-105"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}

            {/* Favorite Button */}
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle();
              }}
              className="absolute top-6 right-6 h-12 w-12 rounded-full shadow-xl bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-transform"
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-all duration-300",
                  isFavorite && "fill-red-500 text-red-500 animate-pulse"
                )}
              />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center px-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 p-0.5 rounded-xl border-2 transition-all duration-300 hover:scale-105",
                currentImageIndex === idx
                  ? "border-primary shadow-lg scale-105"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover rounded-lg"
              />
              {currentImageIndex === idx && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Share Button */}
      <Button
        variant="outline"
        className="w-full h-12 rounded-xl border-2 hover:border-primary transition-all hover:shadow-md"
        onClick={onShare}
      >
        <Share2 className="mr-3 h-5 w-5" />
        Share this product
      </Button>
    </div>
  );
}