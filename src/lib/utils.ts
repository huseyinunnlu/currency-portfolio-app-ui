import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/store/authStore';

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

// Cookie functions
export function setCookie(name: string, value: string, days = 7) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    
    const cookie = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
    document.cookie = cookie;
}

export function getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

export function removeCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

export function decodeToken(token: string) {
    try {
        const decoded = jwtDecode<User>(token)
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return null
        }
        return decoded
    } catch (error) {
        return null
    }
}
