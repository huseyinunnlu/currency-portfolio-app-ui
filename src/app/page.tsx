'use client';

import { useEffect, useMemo, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import CurrencyTable from '@/app/Components/CurrencyTable';
import { ActiveTabType } from '@/app/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabData = [
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

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {
        const urlTab = searchParams.get('tab') as ActiveTabType;
        const isValidTab = urlTab && tabData.some((t) => t.value === urlTab);
        return isValidTab ? (urlTab as ActiveTabType) : 'currency';
    });

    const selectedTab = useMemo(() => tabData.find((tab) => tab.value === activeTab), [activeTab]);

    useEffect(() => {
        router.push(`/?tab=${activeTab}`);
    }, [activeTab]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 flex-col md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl">{selectedTab?.label}</h3>
                <Tabs
                    className="md:max-w-[400px] w-full"
                    value={activeTab}
                    onValueChange={(value) => {
                        setActiveTab(value as ActiveTabType);
                    }}
                >
                    <TabsList className="w-full h-10">
                        {tabData.map((tab) => (
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
            </div>
            <CurrencyTable activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}
