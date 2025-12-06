import { DashboardLayout } from "@/components/layouts/dashboard";
import { Card, CardThumbnail, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const funnelData = [
    {
        type: "impression",
        name: "Impressions",
        count: 2582934,
    },
    {
        type: "visitor",
        name: "Visitors",
        count: 169433,
    },
    {
        type: "add-to-cart",
        name: "Added to cart",
        count: 19341,
    },
    {
        type: "checkout",
        name: "Checked out",
        count: 5403,
    },
    {
        type: "payment-info",
        name: "Entered payment info",
        count: 3432,
    },
    {
        type: "order",
        name: "Successful orders",
        count: 3012,
    },
    {
        type: "completed",
        name: "Completed orders",
        count: 2869,
    },
]

const cardBasises = 
    "basis-1/1 @md/carousel:basis-1/2 @xl/carousel:basis-1/3 @3xl/carousel:basis-1/4 @5xl/carousel:basis-1/5 @7xl/carousel:basis-1/6"

// TODO Implement page
export default function DashboardPage() {
    return <DashboardLayout>
        <h2 className="font-heading text-3xl">Funnel</h2>
        <Carousel className="my-4 -mx-4 border-y" opts={{ align: "start" }}>
          <CarouselContent>
            {funnelData.map((item, index) => (
              <CarouselItem className={cardBasises} key={index}>
                <div className="h-full">
                  <Card className="h-full border-0 border-x -ml-px rounded-none">
                    <CardHeader className="text-sm">
                        <h3>
                            <span className="block text-2xl font-heading">
                                {item.count.toLocaleString("en-US")}
                            </span>
                            <span>
                                {item.name}
                            </span>
                        </h3>
                    </CardHeader>
                    <CardDescription>
                        {index != 0 && <>
                            <div className="leading-tight text-xs">
                                <span className="text-lg font-bold font-heading">
                                    {(item.count / funnelData[index - 1].count * 100).toLocaleString("en-US")}%
                                </span>
                                <span>
                                    {" "}rate
                                </span>
                            </div>
                        </>}
                        {index > 1 && <>
                            <div className="leading-tight text-xs">
                                <span className="text-lg font-bold font-heading">
                                    {(item.count / funnelData[0].count * 100).toLocaleString("en-US")}%
                                </span>
                                <span>
                                    {" "}initial
                                </span>
                            </div>
                        </>}
                    </CardDescription>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
    </DashboardLayout>
}