import { useEffect, useMemo } from 'react';

import { Triangle } from 'lucide-react';

import socket from '@/lib/socketIo';
import { formatNumber } from '@/lib/utils';
import { Currency, useCurrencyStore } from '@/store/currencyStore';
import Link from 'next/link';

export const TICKER_DATA_KEYS = ['H3558', 'o10', 'o11', 'o15', 'o1836'];

export function TickerItem({ currency }: { currency: Currency }) {
    return (
        <Link href={currency._id} className="flex items-center gap-x-2 w-full whitespace-nowrap">
            <span className="font-bold">{currency.title}</span>
            <span>{formatNumber(currency.l)}</span>
            <span
                className={`flex items-center gap-x-1 ${currency.c > 0 ? 'text-green-600 !fill-green-600' : 'text-red-600 !fill-red-600'}`}
            >
                <Triangle
                    className={`!w-4 !h-4 ${currency.c > 0 ? '!fill-green-600' : '!fill-red-600 rotate-180'}`}
                />
                {formatNumber(currency.c)}
            </span>
        </Link>
    );
}

export default function Ticker() {
    const { getByCurrency, currencyData } = useCurrencyStore();

    useEffect(() => {
        socket.emit('triggerCurrencyData', TICKER_DATA_KEYS);
    }, []);

    const tickerData = useMemo(() => getByCurrency(TICKER_DATA_KEYS), [currencyData]);

    return (
        <div className="flex items-center justify-center h-12 w-full overflow-hidden ">
            <div className="flex items-center gap-x-6 animate-marquee">
                {[...(tickerData || []), ...(tickerData || [])].map((currency, index) => (
                    <TickerItem key={index} currency={currency} />
                ))}
            </div>
        </div>
    );
}
