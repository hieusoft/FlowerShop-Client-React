import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductNotFound() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <Card className="max-w-md mx-auto border-2 shadow-2xl overflow-hidden">
        <CardContent className="pt-12 pb-8 px-8">
          <div className="relative mb-8">
            <div className="h-40 w-40 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10 rounded-full" />
              <div className="absolute inset-10 flex items-center justify-center">
                <div className="text-6xl">🔍</div>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-3">Product Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.back()}
              className="flex-1 gap-2"
            >
              <Search className="h-4 w-4" />
              Go Back
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1 gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}