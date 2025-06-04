'use client'

import React from "react";
import { PortfolioData, useGetMyPortfolios, useDeletePortfolio } from "@/queries";

import { Filter } from "@/queries/portfolio";
import { DefinitionTypes, useCurrencyStore } from "@/store/currencyStore";

import { useShallow } from "zustand/react/shallow";
import { Blocks } from "lucide-react";
import { Table } from "lucide-react";
import { TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { TITLES_BY_ID } from "@/constants";
import { Tabs } from "@/components/ui/tabs";
import Spinner from "@/components/Shared/Spinner";
import PortfolioTable from "../PortfolioTable";
import PortfolioCard from "../PortfolioCard";
import { PaginationWrapper } from "@/components/ui/pagination";
import PortfolioDetailSheet from "../PortfolioDetailSheet";
import { toast } from "sonner";

interface MyPortfolioListPageProps {
    filter: Filter;
    setFilter: (filter: Filter) => void;
}

const tableVisibilityTabs = [
    {
        value: 'table',
        label: <Table />,
    },
    {
        value: 'card',
        label: <Blocks />,
    },
]

export default function MyPortfolioListPage({ filter, setFilter }: MyPortfolioListPageProps) {
    const [isSheetOpen, setIsSheetOpen] = React.useState<boolean>(false);
    const [selectedPortfolioId, setSelectedPortfolioId] = React.useState<string | null>(null);
    const [tableVisibility, setTableVisibility] = React.useState<string>(tableVisibilityTabs[0].value);
    const [definitions] = useCurrencyStore(useShallow((state) => [state.definitions]));
    const { data: portfolios, isPending, refetch } = useGetMyPortfolios(filter);
    const { mutate: deletePortfolio, isPending: isDeleting } = useDeletePortfolio();

    const currentPage = Math.floor(filter.offset / filter.limit) + 1;

    const formattedPortfolios = React.useMemo(() => {
        return portfolios?.data?.data?.map((portfolio) => {
            const selectedDefinition = (definitions || []).find((definition) => definition._id === portfolio.assetId);
            return {
                ...portfolio,
                ...selectedDefinition,
                title: TITLES_BY_ID[portfolio.assetId] || "",
                _id: portfolio._id
            }
        }) || [];
    }, [portfolios, definitions]) as Array<PortfolioData & DefinitionTypes & { title: string }>;

    const handlePortfolioClick = (portfolioId: string) => {
        setSelectedPortfolioId(portfolioId);
        setIsSheetOpen(true);
    }

    const handleSheetOpen = (isOpen: boolean) => {
        setIsSheetOpen(isOpen);
        if (!isOpen) {
            setSelectedPortfolioId(null);
        }
    }

    const handleDeletePortfolio = (portfolioId: string) => {
        deletePortfolio(portfolioId, {
            onSuccess: () => {
                toast.success("Portfolio deleted successfully");
                setFilter({ ...filter, offset: 0 });
                refetch();
            },
            onError: () => {
                toast.error("Failed to delete portfolio");
            }
        });
    }
    return (
        <>
            <div className="flex items-center justify-between">
                <Tabs defaultValue={tableVisibility} onValueChange={setTableVisibility} className="ml-auto">
                    <TabsList>
                        {tableVisibilityTabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            <div className="w-full">
                {
                    isPending ? (
                        <div className="flex items-center justify-center w-full h-full">
                            <Spinner className="w-16 h-16 animate-spin" />
                        </div>
                    ) : (
                        <>
                            {tableVisibility === 'table' ? (
                                <PortfolioTable portfolios={formattedPortfolios} onPortfolioClick={handlePortfolioClick} handleDeletePortfolio={handleDeletePortfolio} isDeleting={isDeleting} />
                            ) : (
                                <PortfolioCard portfolios={formattedPortfolios} onPortfolioClick={handlePortfolioClick} handleDeletePortfolio={handleDeletePortfolio} isDeleting={isDeleting} />
                            )}

                            <PaginationWrapper
                                currentPage={currentPage}
                                totalItems={portfolios?.data?.total || 0}
                                itemsPerPage={filter.limit}
                                onPageChange={(page) => setFilter({ ...filter, offset: (page - 1) * filter.limit })}
                                className="mt-8"
                            />
                        </>
                    )
                }
            </div>
            <PortfolioDetailSheet isSheetOpen={isSheetOpen} setIsSheetOpen={handleSheetOpen} selectedPortfolioId={selectedPortfolioId} />
        </>
    );
}
