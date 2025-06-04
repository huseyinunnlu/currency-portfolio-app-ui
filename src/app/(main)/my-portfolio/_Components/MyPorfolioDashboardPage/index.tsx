import { Filter, useGetMyPortfolioDashboardData } from "@/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Shared/Spinner";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatNumber } from "@/lib/utils";
import { TITLES_BY_ID } from "@/constants";
import { useCurrencyStore } from "@/store/currencyStore";
import { useShallow } from "zustand/react/shallow";
import React, { useMemo } from "react";

interface MyPorfolioDashboardPageProps {
    filter: Filter;
    setFilter: (filter: Filter) => void;
}


export default function MyPorfolioDashboardPage({ filter }: MyPorfolioDashboardPageProps) {
    const { data, isLoading } = useGetMyPortfolioDashboardData(filter.type);
    const dashboardData = data?.data;
    const [definitions] = useCurrencyStore(useShallow((state) => [state.definitions]));

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    // Determine currency for formatting based on the first asset's definition
    const currency = useMemo(() => {
        if (!dashboardData?.chartData?.length || !definitions) return "USD";
        const firstAssetDefinition = definitions.find(def => def._id === dashboardData.chartData[0]?.assetId);
        return firstAssetDefinition?.currency || "USD";
    }, [dashboardData?.chartData, definitions]);

    // Format pie chart data with titles and percentages
    const pieData = useMemo(() => {
        if (!dashboardData?.chartData) return [];

        return dashboardData.chartData.map(item => {
            const title = TITLES_BY_ID[item.assetId] || item.assetId;
            const percentage = (item.currentPrice / dashboardData.totalPortfolioCurrentPrice) * 100;

            return {
                name: title,
                shortName: title.length > 8 ? `${title.substring(0, 8)}...` : title,
                value: item.currentPrice,
                assetId: item.assetId,
                percentage,
                formattedPercentage: percentage.toFixed(1) + '%',
                definition: definitions?.find(def => def._id === item.assetId),
                formattedValue: formatNumber(item.currentPrice, {
                    style: 'currency',
                    currency: definitions?.find(def => def._id === item.assetId)?.currency || currency
                })
            };
        });
    }, [dashboardData?.chartData, dashboardData?.totalPortfolioCurrentPrice, definitions, currency]);

    // Create adjusted pie data for visual representation
    const adjustedPieData = useMemo(() => {
        if (!pieData.length || !dashboardData) return [];

        const minPercentageThreshold = 3;
        return pieData.map(item => ({
            ...item,
            visualValue: item.percentage < minPercentageThreshold
                ? (dashboardData.totalPortfolioCurrentPrice * minPercentageThreshold / 100)
                : item.value
        }));
    }, [pieData, dashboardData]);

    // Format bar chart data
    const barData = useMemo(() => {
        if (!dashboardData?.chartData || !definitions) return [];

        return dashboardData.chartData.map(item => {
            const title = TITLES_BY_ID[item.assetId] || item.assetId;
            const definition = definitions.find(def => def._id === item.assetId);
            const buyPricePerUnit = item.buyPrice / item.amount;
            const currentPricePerUnit = item.currentPrice / item.amount;

            return {
                name: title,
                shortName: title.length > 6 ? `${title.substring(0, 6)}...` : title,
                buyPrice: buyPricePerUnit,
                currentPrice: currentPricePerUnit,
                currency: definition?.currency || "USD",
                formattedBuyPrice: formatNumber(buyPricePerUnit, {
                    style: 'currency',
                    currency: definition?.currency || currency
                }),
                formattedCurrentPrice: formatNumber(currentPricePerUnit, {
                    style: 'currency',
                    currency: definition?.currency || currency
                })
            };
        });
    }, [dashboardData?.chartData, definitions, currency]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Spinner />
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px]">
                <h3 className="text-lg font-medium">No portfolio data available</h3>
                <p className="text-muted-foreground">Add assets to your portfolio to see data here</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Portfolio Value</CardTitle>
                        <CardDescription>Current value of all assets</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">
                            {formatNumber(dashboardData.totalPortfolioCurrentPrice, { style: 'currency', currency })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Buy Price</CardTitle>
                        <CardDescription>Initial investment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold truncate">
                            {formatNumber(dashboardData.totalPortfolioBuyPrice, { style: 'currency', currency })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Profit/Loss</CardTitle>
                        <CardDescription>Performance overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-xl font-bold truncate ${dashboardData.totalPortfolioPriceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatNumber(dashboardData.totalPortfolioPriceChange, { style: 'currency', currency })}
                            <span className="text-lg ml-2">
                                ({dashboardData.totalPortfolioPriceChangePercentage.toFixed(2)}%)
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="p-4">
                    <CardHeader>
                        <CardTitle>Portfolio Distribution</CardTitle>
                        <CardDescription>Asset allocation by current value</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={adjustedPieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="visualValue"
                                    nameKey="name"
                                    label={(props) => {
                                        const { cx, cy, midAngle, outerRadius, index } = props;
                                        if (!pieData[index]) return null;

                                        const RADIAN = Math.PI / 180;
                                        const radius = outerRadius + 25;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                        const item = pieData[index];

                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                fill="#000000"
                                                textAnchor={x > cx ? 'start' : 'end'}
                                                dominantBaseline="central"
                                                fontSize={12}
                                                fontWeight="500"
                                            >
                                                {`${item.shortName} ${item.formattedPercentage}`}
                                            </text>
                                        );
                                    }}
                                >
                                    {adjustedPieData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(_value, _name, props) => {
                                        const item = pieData.find(p => p.assetId === props.payload.assetId);
                                        if (!item) return ["", ""];
                                        return [
                                            `${item.formattedValue} (${item.formattedPercentage})`,
                                            item.name
                                        ];
                                    }}
                                    contentStyle={{ fontSize: '12px' }}
                                />
                                <Legend
                                    layout="horizontal"
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="p-4">
                    <CardHeader>
                        <CardTitle>Price Comparison</CardTitle>
                        <CardDescription>Buy price vs current price per unit</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="shortName"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(_value, name, props) => {
                                        const item = barData.find(b =>
                                            (name === "Buy Price" && b.buyPrice === props.payload.buyPrice) ||
                                            (name === "Current Price" && b.currentPrice === props.payload.currentPrice)
                                        );
                                        if (!item) return ["", ""];
                                        return [
                                            name === "Buy Price" ? item.formattedBuyPrice : item.formattedCurrentPrice,
                                            name
                                        ];
                                    }}
                                    contentStyle={{ fontSize: '12px' }}
                                />
                                <Bar dataKey="buyPrice" name="Buy Price" fill="#8884d8" />
                                <Bar dataKey="currentPrice" name="Current Price" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}