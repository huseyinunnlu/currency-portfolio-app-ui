'use client';

import { useEffect, useMemo, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import socket from '@/lib/socketIo';
import { CurrencyHistoryFilters, useGetCurrencyHistory } from '@/queries';
import { useCurrencyStore } from '@/store/currencyStore';

import Header from './Components/Header';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HistoryChart from './Components/HistoryChart';
import Spinner from '@/components/Shared/Spinner';

const filterTabData = [
    {
        label: '1D',
        value: '1d',
    },
    {
        label: '1W',
        value: '1w',
    },
    {
        label: '1M',
        value: '1m',
    },
    {
        label: '3M',
        value: '3m',
    },
    {
        label: '1Y',
        value: '1y',
    },
    {
        label: 'This Year',
        value: 'ty',
    },
];


export default function Page() {
    const { definitions, currencyData, toggleFavorite, favorites } = useCurrencyStore();
    const [ready, setReady] = useState<boolean>(false);
    const [isValidKey, setIsValidKey] = useState<boolean>(false);

    const [filter, setFilter] = useState<CurrencyHistoryFilters>({
        legacyCode: null,
        period: "60",
        startDate: new Date().getTime(),
        endDate: new Date().getTime(),
    });

    const [activeTab, setActiveTab] = useState<string>('1d');

    const router = useRouter();
    const { key } = useParams<{
        key: string;
    }>();

    const { isPending, data } = useGetCurrencyHistory(isValidKey, filter);

    const triggerSelectedKeyLiveData = (key: string) => {
        socket.emit('triggerCurrencyData', [key]);
    };

    const selectedCurrencyData = useMemo(() => {
        if (currencyData && key && isValidKey) {
            return currencyData?.find((item) => item._i === key) || null;
        }

        return null;
    }, [currencyData, key, isValidKey]);

    const generateFilterDates = (tab: string): Omit<CurrencyHistoryFilters, 'legacyCode'> => {
        const todayTimestamp = new Date().getTime();
        const oneDayTimestamp = 24 * 60 * 60 * 1000;
        switch (tab) {
            case '1d':
                return {
                    startDate: new Date(todayTimestamp - oneDayTimestamp).setHours(0, 0, 0, 0),
                    endDate: todayTimestamp,
                    period: "60",
                };
            case '1w':
                return {
                    startDate: new Date(todayTimestamp - (oneDayTimestamp * 7)).setHours(0, 0, 0, 0),
                    endDate: todayTimestamp,
                    period: "60",
                };
            case '1m':
                return {
                    startDate: new Date(todayTimestamp - (oneDayTimestamp * 30)).setHours(0, 0, 0, 0),
                    endDate: todayTimestamp,
                    period: "1440",
                };
            case '3m':
                return {
                    startDate: new Date(todayTimestamp - (oneDayTimestamp * 90)).setHours(0, 0, 0, 0),
                    endDate: todayTimestamp,
                    period: "1440",
                };
            case '1y':
                return {
                    startDate: new Date(todayTimestamp - (oneDayTimestamp * 365)).setHours(0, 0, 0, 0),
                    endDate: todayTimestamp,
                    period: "1440",
                };
            case 'ty':
                return {
                    startDate: new Date(new Date().getFullYear(), 0, 1).getTime(),
                    endDate: todayTimestamp,
                    period: "1440",
                }
            default:
                return {
                    startDate: new Date(todayTimestamp - oneDayTimestamp).setHours(0, 0, 0, 0),
                    endDate: todayTimestamp,
                    period: "60",
                };
        }
    }

    useEffect(() => {
        const selectedDefinition = definitions?.find((item) => item._id === key);
        if (!selectedDefinition) {
            router.push('/');
            return;
        }
        setFilter({
            ...filter,
            legacyCode: selectedDefinition.legacyCode,
            ...generateFilterDates(activeTab),
        });
        setIsValidKey(true);
        triggerSelectedKeyLiveData(selectedDefinition._id);

        setReady(true);
    }, []);

    if (!ready || !isValidKey || !selectedCurrencyData || !currencyData) {
        return 'loading...';
    }

    return (
        <div className="flex flex-col">
            <Header liveCurrencyData={selectedCurrencyData} toggleFavorite={toggleFavorite} isFavorite={selectedCurrencyData?._i ? favorites.includes(selectedCurrencyData._i) : false} />
            <Tabs
                className="md:max-w-[400px] w-full my-8"
                value={activeTab}
                onValueChange={(value) => {
                    setActiveTab(value);
                    setFilter({
                        ...filter,
                        ...generateFilterDates(value),
                    });
                }}
            >
                <TabsList className="w-full h-10">
                    {filterTabData.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="w-full h-full"
                        >
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            {
                isPending || !data?.data ? (
                    <div className="w-full h-48 flex justify-center items-center">
                        <Spinner size={64} />
                    </div>
                ) : (
                    <HistoryChart activeTab={activeTab} currencyHistoryData={data.data} />
                )
            }
        </div>
    );
}
