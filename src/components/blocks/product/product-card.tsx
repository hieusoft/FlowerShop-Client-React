"use client"

import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  images?: string[]
  description?: string
  subOccasionId?: {
    id: string
    name: string
  }
}

export function ProductCard({
  product,
  occasion,
}: {
  product: Product
  occasion: string
}) {
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    const index = cart.findIndex((item: any) => item.id === product.id)

    if (index !== -1) {
      cart[index].quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))

    toast.success("Added to cart", {
      description: product.name,
    })
  }

  return (
    <Card className="group mx-auto h-auto w-full max-w-[220px] overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="relative h-[210px] w-full overflow-hidden bg-white">
        <Link
          href={`/shop/${occasion}/${product.subOccasionId?.name}/${product.id}`}
        >
          <img
            src={
              process.env.NEXT_PUBLIC_API_ROOT +
              (product.images?.[0] || "")
            }
            alt={product.name}
            className="h-full w-full cursor-pointer object-contain p-4 transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-primary hover:text-white">
              <Search className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-xl">
            <AlertDialogHeader>
              <div className="flex items-center justify-between">
                <AlertDialogTitle className="text-xl font-semibold">
                  {product.name}
                </AlertDialogTitle>
                <AlertDialogCancel className="text-lg font-bold text-gray-500 hover:text-red-500">
                  ✕
                </AlertDialogCancel>
              </div>
            </AlertDialogHeader>

            <AlertDialogDescription>
              <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <img
                  src={`http://54.254.156.167:8080${
                    product.images?.[0] || ""
                  }`}
                  alt={product.name}
                  className="h-64 w-full rounded object-contain md:w-1/2"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="mb-2 text-lg font-semibold text-red-600">
                      USD {product.price}
                    </p>
                    {product.description && (
                      <p className="text-gray-700">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-2 md:flex-row">
                    <AlertDialogAction
                      onClick={handleAddToCart}
                      className="w-full rounded bg-primary px-4 py-2 text-center text-white transition hover:bg-primary/80 md:w-auto"
                    >
                      Add to Cart
                    </AlertDialogAction>

                    <button className="w-full rounded bg-green-600 px-4 py-2 text-center text-white transition hover:bg-green-500 md:w-auto">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex flex-1 flex-col justify-between px-4 py-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-red-600">
            USD {product.price}
          </span>

          <button
            onClick={handleAddToCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-primary hover:text-white"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}
