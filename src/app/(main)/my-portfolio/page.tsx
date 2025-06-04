"use client"
import { Button } from '@/components/ui/button';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tabs } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Filter } from '@/queries';
import MyPortfolioListPage from './_Components/MyPortfolioListPage';
import MyPorfolioDashboardPage from './_Components/MyPorfolioDashboardPage';

const mainPageTabs = [
    {
        value: 'dashboard',
        label: 'Dashboard',
    },
    {
        value: 'portfolio',
        label: 'Portfolio',
    },
]

const tabData = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: 'currency',
        label: 'Currency',
    },
    {
        value: 'gold',
        label: 'Gold',
    },
    {
        value: 'favorites',
        label: 'Favorites',
    },
];


function MyPortfolioLayout({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mainPageTab, setMainPageTab] = React.useState<string>(searchParams.get("tab") || mainPageTabs[0].value);
    const [currencyTypeTab, setCurrencyTypeTab] = React.useState<string>(searchParams.get("type") || tabData[0].value);

    const handleMainPageTabChange = (value: string) => {
        setMainPageTab(value);
        const newParams = new URLSearchParams(value === "chart" ? {} : searchParams);
        newParams.set("tab", value);
        router.push(`/my-portfolio?${newParams.toString()}`);
    }

    const handleCurrencyTypeTabChange = (value: string) => {
        setCurrencyTypeTab(value);
        const newParams = new URLSearchParams(value === "chart" ? {} : searchParams);
        newParams.set("type", value);
        if (value !== "chart") {
            newParams.set("offset", "0");
        }
        router.push(`/my-portfolio?${newParams.toString()}`);
    }

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-2xl">My Portfolio</h3>
            <Tabs value={mainPageTab} onValueChange={handleMainPageTabChange}>
                <TabsList variant='line'>
                    {mainPageTabs.map((tab) => (
                        <TabsTrigger variant='line' key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className="flex items-center justify-between">
                <Tabs value={currencyTypeTab} onValueChange={handleCurrencyTypeTabChange}>
                    <TabsList variant='line'>
                        {tabData.map((tab) => (
                            <TabsTrigger variant='line' key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                <Link href="/my-portfolio/create">
                    <Button>
                        <Plus />
                        Add New
                    </Button>
                </Link>
            </div>
            {children}
        </div>

    )
}

export default function MyPortfolio() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Create filter from URL parameters
    const filter = React.useMemo<Filter>(() => ({
        type: searchParams.get("type") || "all",
        limit: parseInt(searchParams.get("limit") || "25"),
        offset: parseInt(searchParams.get("offset") || "0")
    }), [searchParams]);

    // Handle filter changes
    const handleFilterChange = (newFilter: Filter) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("type", newFilter.type);
        newParams.set("limit", newFilter.limit.toString());
        newParams.set("offset", newFilter.offset.toString());
        router.push(`/my-portfolio?${newParams.toString()}`);
    };

    const currentTab = searchParams.get("tab") || mainPageTabs[0].value;

    const renderContent = () => {
        switch (currentTab) {
            case "dashboard":
                return <MyPorfolioDashboardPage filter={filter} setFilter={handleFilterChange} />
            case "portfolio":
                return <MyPortfolioListPage filter={filter} setFilter={handleFilterChange} />
            default:
                return <h3>Not found</h3>
        }
    }
    return (
        <MyPortfolioLayout>
            {
                renderContent()
            }
        </MyPortfolioLayout>
    );
}
