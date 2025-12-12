import { Card, CardContent } from "@/components/ui/card";
import { Truck, Shield, RotateCcw, Clock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: RotateCcw,
    title: "30-Day Returns",
    description: "Easy returns policy",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Shield,
    title: "2-Year Warranty",
    description: "Product protection",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Always here to help",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export default function ProductFeatures() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="border-0 bg-gradient-to-b from-background to-muted/30 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <CardContent className="p-4 text-center">
            <div
              className={`h-12 w-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-3 mx-auto`}
            >
              <feature.icon className={`h-6 w-6 ${feature.color}`} />
            </div>
            <p className="text-sm font-semibold mb-1">{feature.title}</p>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}