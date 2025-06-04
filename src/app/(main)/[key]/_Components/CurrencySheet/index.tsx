'use client';

import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Star, Triangle } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import socket from '@/lib/socketIo';
import { formatNumber } from '@/lib/utils';
import { useCurrencyStore } from '@/store/currencyStore';
import { currencyKeysByTab } from '@/constants';
import { ActiveTabType } from '@/app/types';

interface CurrencySheetProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CurrencySheet({ isOpen, onOpenChange }: CurrencySheetProps) {
    const [activeTab, setActiveTab] = useState<ActiveTabType>('currency');
    const router = useRouter();
    const { getByCurrency, currencyData, toggleFavorite, favorites } = useCurrencyStore();

    useEffect(() => {
        // If favorites tab is selected, emit the favorite currency IDs
        if (activeTab === 'favorites' && favorites.length > 0) {
            socket.emit('triggerCurrencyData', favorites);
        } else {
            socket.emit('triggerCurrencyData', currencyKeysByTab[activeTab]);
        }
    }, [activeTab, favorites]);

    const filteredData = useMemo(() => {
        return getByCurrency(currencyKeysByTab[activeTab]);
    }, [activeTab, getByCurrency, currencyData]);

    const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, currencyId: string) => {
        // Check if the click target is the favorite button or its children
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
            return;
        }
        router.push(`/${currencyId}`);
        onOpenChange(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="sm:max-w-[512px] p-0">
                <SheetHeader className="p-6 border-b">
                    <SheetTitle>Similar Currencies</SheetTitle>
                </SheetHeader>
                <div className="p-6 h-full overflow-y-auto">
                    <Tabs
                        className="w-full mb-6"
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as ActiveTabType)}
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value="currency">Currency</TabsTrigger>
                            <TabsTrigger value="gold">Gold</TabsTrigger>
                            <TabsTrigger value="favorites">Favorites</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="h-12">
                                    <TableHead className="w-[180px]">Symbol</TableHead>
                                    <TableHead>Buying</TableHead>
                                    <TableHead>Selling</TableHead>
                                    <TableHead className="w-12">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData?.map((currency) => (
                                    <TableRow
                                        className="h-16 cursor-pointer hover:bg-gray-50"
                                        key={currency._id}
                                        onClick={(e) => handleRowClick(e, currency._id)}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={`https://web-api.forinvestcdn.com/definitions/icon?code=${currency.code}`}
                                                    alt="icon"
                                                    width={24}
                                                    height={24}
                                                />
                                                <div className="flex flex-col gap-y-1">
                                                    <p className="font-bold text-sm">{currency.title}</p>
                                                    <p className="text-gray-700 text-xs truncate max-w-[100px]">
                                                        {currency.securityDescEn}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{formatNumber(currency.b)}</TableCell>
                                        <TableCell className="text-sm">{formatNumber(currency.a)}</TableCell>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => toggleFavorite(currency._i)}
                                                        className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                    >
                                                        <Star
                                                            className={`w-4 h-4 ${favorites.includes(currency._i) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                                                        />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {favorites.includes(currency._i) ? 'Remove from Favorites' : 'Add to Favorites'}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
} 