"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"

import ProductService from "@/lib/api/ProductService"
import OccasionService from "@/lib/api/OccasionService"
import { CartItem } from "@/models/cart"

import ProductImages from "@/components/blocks/product/ProductImages"
import ProductInfo from "@/components/blocks/product/ProductInfo"
import ProductOptions from "@/components/blocks/product/ProductOptions"
import QuantitySelector from "@/components/blocks/product/QuantitySelector"
import ActionButtons from "@/components/blocks/product/ActionButtons"
import ProductFeatures from "@/components/blocks/product/ProductFeatures"
import ProductTabs from "@/components/blocks/product/ProductTabs"
import LoadingSkeleton from "@/components/blocks/product/LoadingSkeleton"
import ProductNotFound from "@/components/blocks/product/ProductNotFound"

import { Button } from "@/components/ui/button"

interface CheckoutData {
  subtotal: number
  shippingFee: number
  discount: number
  tax: number
  total: number
  couponCode: string
  couponDetails: any | null
  selectedCount: number
  totalItems: number
  cartItems: CartItem[]
  timestamp: string
}

export default function ProductPage() {
  const router = useRouter()
  const { occasion, suboccasion, id } = useParams()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {}
  )
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        if (!id || !suboccasion || Array.isArray(suboccasion)) {
          setProduct(null)
          return
        }

        const productRes = await ProductService.fromId(id as string)
        const occasionRes = await OccasionService.fromId(
          encodeURIComponent(occasion as string)
        )

        if (
          !productRes.data ||
          !productRes.data.subOccasionId?.name
        ) {
          setProduct(null)
          return
        }

        const decodedSuboccasion = decodeURIComponent(suboccasion as string)
        const subOccasions = occasionRes.data?.subOccasions || []

        const validSubOccasion = subOccasions.find(
          (s: any) =>
            s.name.toLowerCase() === decodedSuboccasion.toLowerCase()
        )

        const isValid =
          productRes.data.subOccasionId.name.toLowerCase() ===
            decodedSuboccasion.toLowerCase() && !!validSubOccasion

        setProduct(isValid ? productRes.data : null)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, suboccasion, occasion])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.info("Link copied", {
        description: "Product link copied to clipboard",
      })
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    const cart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    )

    const index = cart.findIndex(item => item.id === product.id)

    if (index !== -1) {
      cart[index].quantity += quantity
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity,
        suboccasion: {
          id: product.subOccasionId?.id,
          name: product.subOccasionId?.name,
          occasionId: product.subOccasionId?.occasionId,
        },
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setQuantity(1)

    toast.success("Added to cart", {
      description: `${product.name} x${quantity}`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    })

    window.dispatchEvent(new Event("cartUpdated"))
  }

  const calculateCheckoutData = (
    product: any,
    quantity: number
  ): CheckoutData => {
    const subtotal = product.price * quantity
    const shippingFee = 2
    const tax = subtotal * 0.08
    const total = subtotal + shippingFee + tax

    return {
      subtotal,
      shippingFee,
      discount: 0,
      tax,
      total,
      couponCode: "",
      couponDetails: null,
      selectedCount: 1,
      totalItems: quantity,
      cartItems: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          quantity,
          suboccasion: {
            id: product.subOccasionId?.id,
            name: product.subOccasionId?.name,
            occasionId: product.subOccasionId?.occasionId,
          },
        },
      ],
      timestamp: new Date().toISOString(),
    }
  }

  const handleBuyNow = () => {
    if (!product) return

    handleAddToCart()
    const checkoutData = calculateCheckoutData(product, quantity)
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    router.push("/checkout")
  }

  const images =
    product?.images?.map(
      (img: string) => `http://54.254.156.167:8080${img}`
    ) || []

  if (loading) return <LoadingSkeleton />
  if (!product) return <ProductNotFound />

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
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
              <li className="cursor-pointer transition-colors hover:text-primary">
                Home
              </li>
              <li>›</li>
              <li className="cursor-pointer transition-colors hover:text-primary">
                {product.subOccasionId?.occasionId?.name || "Products"}
              </li>
              <li>›</li>
              <li className="cursor-pointer transition-colors hover:text-primary">
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

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <ProductImages
          images={images}
          productName={product.name}
          isFavorite={isFavorite}
          onFavoriteToggle={() => setIsFavorite(!isFavorite)}
          onShare={handleShare}
        />

        <div className="space-y-8 lg:w-1/2">
          <ProductInfo
            name={product.name}
            category={product.subOccasionId?.name}
            price={product.price}
            stock={product.stock || 128}
            description={product.description}
          />

          {product.options?.length > 0 && (
            <ProductOptions
              options={product.options}
              selectedOptions={selectedOptions}
              onOptionChange={(id, value) =>
                setSelectedOptions(prev => ({
                  ...prev,
                  [id]: value,
                }))
              }
            />
          )}

          <QuantitySelector
            quantity={quantity}
            onIncrement={() => setQuantity(q => q + 1)}
            onDecrement={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
            max={product.stock || 99}
          />

          <ActionButtons
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />

          <ProductFeatures />

          <ProductTabs
            description={product.description}
            productId={product.id}
            category={product.subOccasionId?.name}
            tags={product.tags}
          />
        </div>
      </div>
    </div>
  )
}
