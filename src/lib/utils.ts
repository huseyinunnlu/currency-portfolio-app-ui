import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(
    value: number | string | null | undefined,
    options?: {
        maximumFractionDigits?: number;
        minimumFractionDigits?: number;
        style?: 'currency' | 'decimal' | 'percent';
        currency?: string;
    }
) {
    if (value === null || value === undefined) return '-';

    const numericValue = typeof value === 'number' ? value : Number(value);

    if (isNaN(numericValue)) return '-';

    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: options?.maximumFractionDigits ?? 2,
        minimumFractionDigits: options?.minimumFractionDigits ?? 2,
        style: options?.style ?? 'decimal',
        currency: options?.currency,
    }).format(numericValue);
}
