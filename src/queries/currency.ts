import { DefinitionTypes, FieldTypes } from '@/store/currencyStore';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export interface DefinitionsResponse {
    definitions: DefinitionTypes[];
    fields: FieldTypes[];
    expire: number;
}

export interface CurrencyHistoryFilters {
    startDate: number;
    endDate: number;
    legacyCode: string | null;
    period: "60" | "1440";
}

export interface CurrencyHistoryResponse {
    d: number;
    o: number;
    h: number;
    l: number;
    c: number;
}

const getDefinitionsFn = async (): Promise<AxiosResponse<DefinitionsResponse>> => {
    return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/definitions`);
};

const getCurrencyHistory = async (filters: CurrencyHistoryFilters): Promise<AxiosResponse<CurrencyHistoryResponse[]>> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/currency-history/${encodeURIComponent(filters.legacyCode || "")}?startDate=${filters.startDate}&endDate=${filters.endDate}&period=${filters.period}`;

    return await axios.get(url);
};

export const useGetDefinitions = () => {
    return useQuery({
        queryKey: ['GET_DEFINITIONS'],
        queryFn: getDefinitionsFn,
    });
};

export const useGetCurrencyHistory = (isValidKey: boolean, filters: CurrencyHistoryFilters) => {
    return useQuery({
        queryKey: ['GET_CURRENCY_HISTORY', filters, isValidKey],
        enabled: isValidKey,
        queryFn: () => getCurrencyHistory(filters),
    });
};
