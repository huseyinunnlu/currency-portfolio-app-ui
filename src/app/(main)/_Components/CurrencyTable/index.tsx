'use client';

import { useEffect, useMemo } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Star, Triangle } from 'lucide-react';

import { CurrencyTablePropTypes } from '@/app/types';
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

export default function CurrencyTable({ activeTab }: CurrencyTablePropTypes) {
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
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="h-12">
                    <TableHead className="w-[220px]">Symbol</TableHead>
                    <TableHead className="hidden md:table-cell">End</TableHead>
                    <TableHead className="hidden lg:table-cell">Difference %</TableHead>
                    <TableHead className="hidden lg:table-cell">Difference</TableHead>
                    <TableHead>Buying</TableHead>
                    <TableHead>Selling</TableHead>
                    <TableHead className="hidden md:table-cell">D. High</TableHead>
                    <TableHead className="hidden md:table-cell">D. Low</TableHead>
                    <TableHead className="w-32 hidden sm:table-cell">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredData?.map((currency) => (
                    <TableRow
                        className="h-16 cursor-pointer hover:bg-gray-50"
                        key={currency._id}
                        onClick={(e) => handleRowClick(e, currency._id)}
                    >
                        <TableCell className="font-medium w-[210px]">
                            <div className="flex items-center gap-4">
                                <Image
                                    src={`https://web-api.forinvestcdn.com/definitions/icon?code=${currency.code}`}
                                    alt="icon"
                                    width={32}
                                    height={32}
                                />
                                <div className="flex flex-col gap-y-1">
                                    <p className="font-bold">{currency.title}</p>
                                    <p className="text-gray-700 text-xs truncate max-w-[110px]">
                                        {currency.securityDescEn}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="font-medium hidden md:table-cell">{formatNumber(currency.l)}</TableCell>
                        <TableCell
                            className={`hidden lg:table-cell ${currency.c > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                            <div className="flex items-center gap-x-1">
                                <Triangle
                                    className={`!w-4 !h-4 ${currency.c > 0 ? '!fill-green-600' : '!fill-red-600 rotate-180'}`}
                                />
                                {formatNumber(currency.c / currency.l, {
                                    style: 'percent',
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                        </TableCell>
                        <TableCell
                            className={`hidden lg:table-cell ${Number(currency.c) > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                            <div className="flex items-center gap-x-1">
                                <Triangle
                                    className={`!w-4 !h-4 ${Number(currency.c) > 0 ? '!fill-green-600' : '!fill-red-600 rotate-180'}`}
                                />
                                {formatNumber(currency.c)}
                            </div>
                        </TableCell>
                        <TableCell>{formatNumber(currency.b)}</TableCell>
                        <TableCell>{formatNumber(currency.a)}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatNumber(currency.h)}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatNumber(currency.L)}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => toggleFavorite(currency._i)}
                                        className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <Star
                                            className={`w-5 h-5 ${favorites.includes(currency._i) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
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
    );
}
