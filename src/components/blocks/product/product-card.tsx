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

export function ProductCard({
    product,
}: {
    product: {
        id: number;
        name: string;
        price: number;
        images?: string[];
        description?: string;
    };
}) {
    return (
        <Card className="group w-[220px] h-[330px] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border">
            <div className="relative w-full h-[210px] bg-white overflow-hidden">
                <img
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                    src={`http://54.254.156.167:8080${product.images?.[0] || ""}`}
                    alt={product.name}
                />

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition">
                            <Search className="w-4 h-4" />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-sm">
                        <AlertDialogHeader>
                            <AlertDialogTitle>{product.name}</AlertDialogTitle>
                            <AlertDialogDescription>
                                <img
                                    className="w-full h-40 object-contain mb-2"
                                    src={`http://54.254.156.167:8080${product.images?.[0] || ""}`}
                                    alt={product.name}
                                />
                                <p className="text-lg font-semibold text-red-600">USD {product.price}</p>
                                {product.description && <p className="mt-2 text-gray-700">{product.description}</p>}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                            <AlertDialogAction>Add to Cart</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex flex-col justify-between flex-1 px-4 py-3">
                <h3 className="text-sm font-semibold line-clamp-2 leading-snug text-gray-800">
                    {product.name}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                    <span className="text-red-600 text-lg font-bold">USD {product.price}</span>
                    <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition">
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Card>
    );
}
