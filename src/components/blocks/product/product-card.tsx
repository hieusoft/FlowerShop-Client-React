// ProductCard.tsx
import { Card } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function ProductCard({
    product,
    occasion,
}: {
    product: {
        id: string;
        name: string;
        price: number;
        images?: string[];
        description?: string;
        subOccasionId?: {
            id: string;
            name: string;
        };
    };
    occasion: string;
}) {

    const handleAddToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const existingIndex = cart.findIndex(
            (item: any) => item.id === product.id
        );

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                quantity: 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Đã thêm vào giỏ hàng!");
    };

    return (
        <Card className="group w-full max-w-[220px] h-auto rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border mx-auto">
            <div className="relative w-full h-[210px] bg-white overflow-hidden">
                <Link href={`/shop/${occasion}/${product.subOccasionId?.name}/${product.id}`}>
                    <img
                        className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                        src={`http://54.254.156.167:8080${product.images?.[0] || ""}`}
                        alt={product.name}
                    />
                </Link>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition">
                            <Search className="w-4 h-4" />
                        </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="max-w-xl">
                        <AlertDialogHeader>
                            <div className="flex justify-between items-center">
                                <AlertDialogTitle className="text-xl font-semibold">
                                    {product.name}
                                </AlertDialogTitle>
                                <AlertDialogCancel className="text-gray-500 hover:text-red-500 font-bold text-lg">
                                    ✕
                                </AlertDialogCancel>
                            </div>
                        </AlertDialogHeader>

                        <AlertDialogDescription>
                            <div className="flex flex-col md:flex-row gap-4 mt-4">
                                <img
                                    className="w-full md:w-1/2 h-64 object-contain rounded"
                                    src={`http://54.254.156.167:8080${product.images?.[0] || ""}`}
                                    alt={product.name}
                                />

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-red-600 mb-2">
                                            USD {product.price}
                                        </p>
                                        {product.description && (
                                            <p className="text-gray-700">
                                                {product.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-col md:flex-row gap-2">
                                        {/* ✅ Add to Cart */}
                                        <AlertDialogAction
                                            onClick={handleAddToCart}
                                            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition w-full md:w-auto text-center"
                                        >
                                            Add to Cart
                                        </AlertDialogAction>

                                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition w-full md:w-auto text-center">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex flex-col justify-between flex-1 px-4 py-3">
                <h3 className="text-sm font-semibold line-clamp-2 leading-snug text-gray-800">
                    {product.name}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-red-600 text-lg font-bold">
                        USD {product.price}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition"
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Card>
    );
}
