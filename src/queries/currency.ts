import { useQuery } from '@tanstack/react-query';

import apiClient from '@/lib/apiClient';
import { ApiResponse } from '@/lib/apiClient';
import { getCookie } from '@/lib/utils';
import { Currency, DefinitionTypes, useCurrencyStore } from '@/store/currencyStore';
import { FieldTypes } from '@/store/currencyStore';

export interface DefinitionsResponse {
    definitions: DefinitionTypes[];
    fields: FieldTypes[];
    expire: number;
}

export interface CurrencyHistoryFilters {
    startDate: number;
    endDate: number;
    legacyCode: string | null;
    period: '60' | '1440';
}

export interface CurrencyHistoryResponse {
    d: number;
    o: number;
    h: number;
    l: number;
    c: number;
}

/**
 * Get currency definitions and field mappings
 */
const getDefinitions = async (): Promise<ApiResponse<DefinitionsResponse>> => {
    return await apiClient.get<DefinitionsResponse>('/definitions');
};

/**
 * Get historical currency data
 */
const getCurrencyHistory = async (
    filters: CurrencyHistoryFilters
): Promise<ApiResponse<CurrencyHistoryResponse[]>> => {
    const url = `/currency-history/${encodeURIComponent(filters.legacyCode || '')}?startDate=${filters.startDate}&endDate=${filters.endDate}&period=${filters.period}`;
    return await apiClient.get<CurrencyHistoryResponse[]>(url);
};

const getCurrentPricesByKeys = async (keys: string[]): Promise<ApiResponse<Currency[]>> => {
    return await apiClient.post<Currency[]>(
        `/get-current-prices-by-keys`,
        { keys },
        {
            headers: {
                Authorization: `Bearer ${getCookie('auth_token')}`,
            },
        }
    );
};

export const useGetDefinitions = () => {
    return useQuery({
        queryKey: ['GET_DEFINITIONS'],
        queryFn: getDefinitions,
    });
};

export const useGetCurrencyHistory = (isValidKey: boolean, filters: CurrencyHistoryFilters) => {
    return useQuery({
        queryKey: ['GET_CURRENCY_HISTORY', filters, isValidKey],
        enabled: isValidKey,
        queryFn: () => getCurrencyHistory(filters),
    });
};

export const useGetCurrentPricesByKeys = (keys: string[]) => {
    return useQuery({
        queryKey: ['GET_CURRENT_PRICES_BY_KEYS'],
        queryFn: () => getCurrentPricesByKeys(keys),
        select: (data) => {
            return useCurrencyStore.getState().formatCurrencyData(data.data || []);
        },
    });
};
