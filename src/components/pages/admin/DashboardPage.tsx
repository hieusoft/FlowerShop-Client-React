"use client";

import { SectionCards } from "@/components/blocks/dashboard/section-card";
import { DashboardLayout } from "@/components/layouts/dashboard";
import { Card, CardThumbnail, CardHeader, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn, FormattableUnit, formatUnit, formatWhole } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AreaChart, Area, LineChart, Line, YAxis, BarChart, Bar, XAxis } from "recharts";
import { ClassNameValue } from "tailwind-merge";

function randomData() {
    let value: number = Math.random() * 5 + 2.5;
    let velocity: number = Math.random();
    return new Array(30).fill("").map((x, i) => {
        value += velocity;
        velocity = 1 + velocity / 2 - value / 5 + (Math.random() - 0.5) + 10 * (Math.random() - 0.5) ** 4;
        return { x: i, y: value }
    });
}

const smallCardBasises =
    "basis-1/1 @md/carousel:basis-1/2 @xl/carousel:basis-1/3 @3xl/carousel:basis-1/4 @5xl/carousel:basis-1/5 @7xl/carousel:basis-1/6"

const largeCardBasises =
    "basis-1/1 @xl/carousel:basis-1/2 @3xl/carousel:basis-1/3 @6xl/carousel:basis-1/4"

const conversionData = [
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
];

const vitalsData = [
    {
        type: "overall",
        name: "Overall",
        lcp: { average: 0.74, thresholds: [0.9, 0.07, 0.03] },
        inp: { average: 0.14, thresholds: [0.85, 0.09, 0.06] },
        cls: { average: 0.01, thresholds: [0.98, 0.01, 0.01] },
    },
    {
        type: "home-page",
        name: "Home page",
        lcp: { average: 0.74, thresholds: [0.9, 0.07, 0.03] },
        inp: { average: 0.14, thresholds: [0.85, 0.09, 0.06] },
        cls: { average: 0.01, thresholds: [0.98, 0.01, 0.01] },
    },
    {
        type: "list-pages",
        name: "List pages",
        lcp: { average: 0.74, thresholds: [0.9, 0.07, 0.03] },
        inp: { average: 0.14, thresholds: [0.85, 0.09, 0.06] },
        cls: { average: 0.01, thresholds: [0.98, 0.01, 0.01] },
    },
    {
        type: "item-pages",
        name: "Item pages",
        lcp: { average: 0.74, thresholds: [0.9, 0.07, 0.03] },
        inp: { average: 0.14, thresholds: [0.85, 0.09, 0.06] },
        cls: { average: 0.01, thresholds: [0.98, 0.01, 0.01] },
    },
]

const trendsData = [
    {
        type: "most-view-items",
        name: "Most viewed items",
        data: [
            { name: "Bouquet #4" },
            { name: "Bouquet #2" },
            { name: "Bouquet #10" },
            { name: "Bouquet #6" },
            { name: "Bouquet #9" },
            { name: "Bouquet #13" },
            { name: "Bouquet #3" },
            { name: "Bouquet #7" },
        ]
    },
]

type OrderInfo = Array<{
    time_bucket: string,
    count: number,
    revenue: number
}>

type UserInfo = {
    totalItems: number
}

type ProductInfo = {
    totalItems: number
}


export default function DashboardPage() {
    const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);

    useEffect(() => {
        OrderService.queryAnalytics(7).then(({data}) => {
            setOrderInfo(data);
        })
        UserService.list({ limit: 10 }).then(({data}) => {
            setUserInfo(data);
        })
        ProductService.list({ limit: 10 }).then(({data}) => {
            setProductInfo(data);
        })
    }, [])

    const performanceData = [
        ...(orderInfo ? [
            {
                type: "revenue",
                name: "Revenue",
                count: orderInfo.reduce((x, y) => x + y.revenue, 0),
                unit: "currency/vnd",
                graph: orderInfo.map(({time_bucket, revenue}) => ({ x: new Date(time_bucket), y: revenue }))
            },
            {
                type: "orders",
                name: "Orders",
                count: orderInfo.reduce((x, y) => x + y.count, 0),
                unit: "unit",
                graph: orderInfo.map(({time_bucket, count}) => ({ x: new Date(time_bucket), y: count }))
            },
        ] : []),
        ...(userInfo ? [
            {
                type: "users",
                name: "Users",
                count: userInfo.totalItems,
                unit: "unit",
                graph: randomData(),
            },
        ] : []),
        ...(productInfo ? [
            {
                type: "items",
                name: "Items",
                count: productInfo.totalItems,
                unit: "unit",
                graph: randomData(),
            },
        ] : []),
    ];

    return (
        <DashboardLayout breadcrumb={["Admin", "Overview"]}>
            {/* <h2 className="font-heading text-3xl">Notifications</h2>
            <Card className="my-4 py-4 -mx-4 border-x-0 rounded-none">
                <CardDescription className="text-center">
                    No recent notifications.
                </CardDescription>
            </Card>
            <h2 className="font-heading text-3xl">Performance</h2>
            <Carousel className="my-4 -mx-4 border-y" opts={{ align: "start" }}>
                <CarouselContent>
                    {performanceData.map((item, index) => (
                    <CarouselItem className={largeCardBasises} key={index}>
                        <div className="h-full">
                        <Card className="h-full border-0 border-x -ml-px rounded-none">
                            <CardThumbnail className="border-b-0 h-30 p-4 -mb-6 aspect-auto">
                                <SimpleChart data={item.graph} color={index} />
                            </CardThumbnail>
                            <CardHeader className="text-sm">
                                <h3>
                                    <span className="block text-2xl font-heading">
                                        {formatUnit(item.count, item.unit as FormattableUnit)}
                                    </span>
                                    <span>
                                        {item.name}
                                    </span>
                                </h3>
                            </CardHeader>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <h2 className="font-heading text-3xl">Conversion</h2>
            <Carousel className="my-4 -mx-4 border-y" opts={{ align: "start" }}>
                <CarouselContent>
                    {conversionData.map((item, index) => (
                    <CarouselItem className={smallCardBasises} key={index}>
                        <div className="h-full">
                        <Card className="h-full border-0 border-x -ml-px rounded-none">
                            <CardThumbnail className="border-b-0 h-30 p-4 -mb-6 aspect-auto">
                                <SimpleChart data={randomData()} dataKey="value" color={index} />
                            </CardThumbnail>
                            <CardHeader className="text-sm">
                                <h3>
                                    <span className="block text-2xl font-heading">
                                        {formatWhole(item.count)}
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
                                            {(item.count / conversionData[index - 1].count * 100).toLocaleString("en-US")}%
                                        </span>
                                        <span>
                                            {" "}rate
                                        </span>
                                    </div>
                                </>}
                                {index > 1 && <>
                                    <div className="leading-tight text-xs">
                                        <span className="text-lg font-bold font-heading">
                                            {(item.count / conversionData[0].count * 100).toLocaleString("en-US")}%
                                        </span>
                                        <span>
                                            {" "}rate from initial
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
            <h2 className="font-heading text-3xl">Trends</h2>
            <Carousel className="my-4 -mx-4 border-y" opts={{ align: "start" }}>
                <CarouselContent>
                    {trendsData.map((item, index) => (
                    <CarouselItem className={largeCardBasises} key={index}>
                        <div className="h-full">
                            <Card className="h-full border-0 border-x -ml-px rounded-none">
                                <CardHeader>
                                    <h3>
                                        {item.name}
                                    </h3>
                                </CardHeader>
                                <CardDescription>
                                    <ol className="flex flex-col gap-2">
                                        {item.data.map((listItem, index) => (
                                            <li key={index} className="flex gap-2 items-center">
                                                <span className="flex items-center justify-center font-heading text-bold size-8 border bg-background rounded-full text-lg">
                                                    {index + 1}
                                                </span>
                                                <span className="line-clamp-2 text-xs flex-1"> 
                                                    {listItem.name}
                                                </span>
                                                <SimpleChart 
                                                    className="w-20 h-8"
                                                    data={randomData()} 
                                                    dataKey="value" color={0} />
                                            </li>
                                        ))}
                                    </ol>
                                </CardDescription>
                            </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <h2 className="font-heading text-3xl">Web vitals</h2>
            <Carousel className="my-4 -mx-4 border-y" opts={{ align: "start" }}>
                <CarouselContent>
                    {vitalsData.map((item, index) => (
                    <CarouselItem className={largeCardBasises} key={index}>
                        <div className="h-full">
                        <Card className="h-full border-0 border-x -ml-px rounded-none">
                            <CardHeader>
                                <h3>
                                    {item.name}
                                </h3>
                            </CardHeader>
                            <CardDescription>
                                {(["lcp", "inp", "cls"] as ("lcp" | "inp" | "cls")[]).map((stat) => (
                                    <div className="leading-tight text-xs" key={stat}>
                                        <span className="text-2xl font-heading">
                                            {stat == "cls" ? formatWhole(item[stat].average, 3) : formatWhole(item[stat].average, 3) + "s"}
                                        </span>
                                        <span>
                                            {" " + stat.toUpperCase()}
                                        </span>
                                        <div 
                                            className="relative grid h-3 py-1 -mx-px *:mx-px *:rounded-xs mb-2" 
                                            style={{ gridTemplateColumns: item[stat].thresholds.map(x => x + "fr").join(" ") }}
                                        >
                                            <div className="bg-green-600 dark:bg-green-500"></div>
                                            <div className="bg-orange-600 dark:bg-orange-500"></div>
                                            <div className="bg-red-700 dark:bg-red-500"></div>
                                            <div className="absolute bg-foreground w-px inset-y-0 left-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </CardDescription>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel> */}
            <SidebarProvider
            >
                <SidebarInset>
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                                <SectionCards />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </DashboardLayout>
    )
}

function SimpleChart(
    { data, dataKey, color, className }: {
        data: object[],
        dataKey: string,
        color: number
        className?: ClassNameValue
    }
) {
    color = (color % 5) + 1;
    // eslint-disable-next-line react-hooks/purity
    const key: string = Math.random().toString().substring(2);

    return (
        <AreaChart
            className={cn("h-[calc(100%+10px)] w-[calc(100%+10px)] -m-[5px]", className)} responsive
            data={data}
        >
            <defs>
                <linearGradient id={`chart-fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={`var(--chart-${color})`} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={`var(--chart-${color})`} stopOpacity={0} />
                </linearGradient>
            </defs>
            <YAxis width={0} visibility="hidden" domain={([min, max]) => [min - (max - min) * 0.1, max]} />
            <Area
                type="monotone" dataKey={dataKey} dot={false} activeDot={false}
                isAnimationActive={false}
                stroke={`var(--chart-${color})`} strokeWidth={1.2}
                fill={`url(#chart-fill-${key})`}
            />
        </AreaChart>
    )
}