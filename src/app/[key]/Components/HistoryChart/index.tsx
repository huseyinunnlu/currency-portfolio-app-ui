"use client"

import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { CurrencyHistoryResponse } from "@/queries/currency"
const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    price: {
        label: "Price: ",
        color: "var(--primary)",
    },
} satisfies ChartConfig

export default function HistoryChart({ activeTab, currencyHistoryData }: { activeTab: string, currencyHistoryData: CurrencyHistoryResponse[] }) {
    const transformedData = useMemo(() => {
        return currencyHistoryData.map(item => {
            const date = new Date(item.d);
            const day = date.toLocaleDateString('en-GB', { day: '2-digit' });
            const month = date.toLocaleDateString('en-US', { month: 'short' });

            if (activeTab === "1d" || activeTab === "1w") {
                const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
                return {
                    date: `${day} ${month} ${time}`,
                    price: item.c,
                }
            } else {
                return {
                    date: `${day} ${month}`,
                    price: item.c,
                }
            }
        });
    }, [currencyHistoryData, activeTab]);

    if (transformedData.length === 0) {
        return <p>No data available for the chart.</p>;
    }
    return (

        <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <AreaChart
                accessibilityLayer
                data={transformedData}
                margin={{
                    left: 12,
                    right: 12,
                    top: 5,
                    bottom: 5
                }}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => value.toFixed(1)}
                    dataKey="price"
                    domain={['dataMin - (dataMin * 0.001)', 'dataMax + (dataMax * 0.001)']}
                />
                <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                    dataKey="price"
                    type="linear"
                    fill="var(--color-price)"
                    fillOpacity={0.4}
                    stroke="var(--color-price)"
                    strokeWidth={2}
                />
            </AreaChart>
        </ChartContainer>

    )
}
