import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Image Section */}
        <div className="lg:w-1/2 space-y-4">
          <Card>
            <CardContent className="p-0">
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </CardContent>
          </Card>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* Info Section */}
        <div className="lg:w-1/2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-10 w-40 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-32" />
              ))}
            </div>
          </div>
          
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}