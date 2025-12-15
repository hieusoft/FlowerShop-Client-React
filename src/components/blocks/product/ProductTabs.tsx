import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  description?: string;
  specifications?: Record<string, any>;
  productId?: string;
  category?: string;
  tags?: string[];
}

export default function ProductTabs({
  description,
  specifications,
  productId,
  category,
  tags = [],
}: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="pt-8">
      <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/50 p-1">
        <TabsTrigger
          value="description"
          className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="specifications"
          className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
        >
          Specifications
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="pt-6">
        <Card className="border-2 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {description || "No description available."}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="specifications" className="pt-6">
        <Card className="border-2 rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">SKU</span>
                    <span className="font-mono text-sm">
                      {productId?.slice(0, 8) || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">Category</span>
                    <span className="font-medium">{category || "Uncategorized"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">Weight</span>
                    <span className="font-medium">1.2 kg</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium">Dimensions</span>
                    <span className="font-medium">10 × 5 × 3 cm</span>
                  </div>
                </div>
              </div>
              
              {tags.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}