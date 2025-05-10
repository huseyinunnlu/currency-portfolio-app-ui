'use client';

import React, { useMemo } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { DotIcon, Triangle, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/utils';
import { Currency } from '@/store/currencyStore';


interface HeaderPropTypes {
    liveCurrencyData: Currency;
    toggleFavorite: (id: string) => void;
    isFavorite: boolean;
}

export default function Header({ liveCurrencyData, toggleFavorite, isFavorite }: HeaderPropTypes) {
    const isPositiveChange = (liveCurrencyData?.c ?? 0) > 0;
    const changePercentage = formatNumber(
        (liveCurrencyData?.l && liveCurrencyData?.c) ? (liveCurrencyData.c / liveCurrencyData.l) : 0,
        {
            style: 'percent',
            maximumFractionDigits: 2,
        }
    );
    const changeValue = formatNumber(liveCurrencyData?.c ?? 0);

    const changeData = useMemo(() => [
        {
            label: 'Weekly Change',
            low: liveCurrencyData?.Wl ?? 0,
            high: liveCurrencyData?.Wh ?? 0,
            percentage: liveCurrencyData?.wp ?? 0,
        },
        {
            label: 'Monthly Change',
            low: liveCurrencyData?.Ml ?? 0,
            high: liveCurrencyData?.Mh ?? 0,
            percentage: liveCurrencyData?.mp ?? 0,
        },
        {
            label: 'Yearly Change',
            low: liveCurrencyData?.Yl ?? 0,
            high: liveCurrencyData?.Yh ?? 0,
            percentage: liveCurrencyData?.yp ?? 0,
        },
    ], [liveCurrencyData]);

    return (
        <div className="flex flex-col md:flex-row">
            <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-4">
                    <Image
                        src={`https://web-api.forinvestcdn.com/definitions/icon?code=${liveCurrencyData?.code || ''}`}
                        alt="icon"
                        width={52}
                        height={52}
                    />
                    <div className="flex flex-col">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/">Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <DotIcon className="w-2 h-2" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>{liveCurrencyData?.title || 'N/A'}</BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <h3 className="text-2xl font-semibold">{liveCurrencyData?.securityDescEn || 'N/A'}</h3>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => toggleFavorite(liveCurrencyData?._i)}
                                className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors md:top-auto md:right-auto"
                            >
                                <Star
                                    className={`w-6 h-6 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                                />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className="flex md:items-center gap-4 md:flex-row sm:flex-row flex-col">
                    <h3 className="text-3xl font-semibold">{formatNumber(liveCurrencyData?.l ?? 0)}</h3>
                    <div className="flex items-center gap-x-4">
                        <Badge
                            className={`${isPositiveChange ? 'bg-green-600' : 'bg-red-600'} py-1`}
                        >
                            <div className="flex items-center gap-x-1">
                                <Triangle
                                    className={`!w-4 !h-4 ${isPositiveChange ? '!fill-white' : '!fill-white rotate-180'}`}
                                />
                                {changePercentage}
                            </div>
                        </Badge>
                        <div
                            className={`flex items-center gap-x-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}
                        >
                            <Triangle
                                className={`!w-4 !h-4 ${isPositiveChange ? '!fill-green-600' : '!fill-red-600 rotate-180'}`}
                            />
                            {changeValue}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-auto md:ml-auto flex flex-col gap-y-1 mt-6 md:mt-0">
                {changeData.map((item) => (
                    <div key={item.label} className="flex flex-col xs:flex-row items-start xs:items-center justify-start xs:justify-between gap-x-0 xs:gap-x-4 gap-y-1">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex items-center gap-x-2">
                            <span className="text-sm font-medium text-gray-800">{formatNumber(item.low)}</span>
                            <span className="text-sm text-gray-500">{'->'}</span>
                            <span className="text-sm font-medium text-gray-800">{formatNumber(item.high)}</span>
                            <Badge
                                className={`py-0.5 px-1.5 text-xs ${item.percentage > 0 ? 'bg-green-100 text-green-700' : item.percentage < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                            >
                                {formatNumber(item.percentage / 100, { style: 'percent', maximumFractionDigits: 2 })}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
