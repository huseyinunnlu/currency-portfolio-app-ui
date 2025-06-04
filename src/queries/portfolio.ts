import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiResponse, PaginatedResponse } from '@/lib/apiClient';
import apiClient from '@/lib/apiClient';
import { getCookie } from '@/lib/utils';
import { CurrencyData } from '@/store/currencyStore';

export interface PortfolioFormTypes {
    portfolioType: 'currency' | 'gold' | 'my-portfolio';
    assetId: string;
    assetPrice: number;
    amount: number;
    date: Date;
}

export interface PortfolioData {
    _id: string;
    userId: string;
    portfolioType: string;
    assetId: string;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    assetPrice: number;
    currentPrice: number;
    change: number;
    changePercentage: number;
}

export interface Filter {
    type: string;
    limit: number;
    offset: number;
}

export interface PortfolioDashboardChartData {
    assetId: string;
    amount: number;
    buyPrice: number;
    currentPrice: number;
}

export interface PortfolioDashboardData {
    totalPortfolioBuyPrice: number;
    totalPortfolioCurrentPrice: number;
    totalPortfolioPriceChange: number;
    totalPortfolioPriceChangePercentage: number;
    chartData: PortfolioDashboardChartData[];
}

export interface PortfolioHistory {
    _id: string;
    assetPrice: number;
    amount: number;
    date: string;
}

export interface PortfolioDetails {
    portfolio: Pick<
        PortfolioData,
        '_id' | 'userId' | 'portfolioType' | 'assetId' | 'createdAt' | 'updatedAt'
    >;
    history: PortfolioHistory[];
    livePriceData: CurrencyData;
    amount: number;
    assetPrice: number;
    currentPrice: number;
    change: number;
    changePercentage: number;
}

const createPortfolio = async (form: PortfolioFormTypes): Promise<ApiResponse<string>> => {
    return await apiClient.post<string>(`/portfolio-create`, form, {
        headers: {
            Authorization: `Bearer ${getCookie('auth_token')}`,
        },
    });
};

const getMyPortfolios = async (
    filter: Filter
): Promise<ApiResponse<PaginatedResponse<PortfolioData[]>>> => {
    return await apiClient.get<PaginatedResponse<PortfolioData[]>>(
        `/portfolio-list?type=${filter.type}&limit=${filter.limit}&offset=${filter.offset}`,
        {
            headers: {
                Authorization: `Bearer ${getCookie('auth_token')}`,
            },
        }
    );
};

const getMyPortfolioDashboardData = async (
    type: string
): Promise<ApiResponse<PortfolioDashboardData>> => {
    return await apiClient.get<PortfolioDashboardData>(`/portfolio-dashboard-data?type=${type}`, {
        headers: {
            Authorization: `Bearer ${getCookie('auth_token')}`,
        },
    });
};

const getPortfolioDetails = async (portfolioId: string): Promise<ApiResponse<PortfolioDetails>> => {
    return await apiClient.get<PortfolioDetails>(`/portfolio-details/${portfolioId}`, {
        headers: {
            Authorization: `Bearer ${getCookie('auth_token')}`,
        },
    });
};

const deletePortfolio = async (portfolioId: string): Promise<ApiResponse<string>> => {
    return await apiClient.delete<string>(`/portfolio-delete/${portfolioId}`, {
        headers: {
            Authorization: `Bearer ${getCookie('auth_token')}`,
        },
    });
};

const deletePortfolioItem = async (
    portfolioId: string,
    portfolioItemId: string
): Promise<ApiResponse<string>> => {
    return await apiClient.delete<string>(
        `/portfolio/${portfolioId}/item-delete/${portfolioItemId}`,
        {
            headers: {
                Authorization: `Bearer ${getCookie('auth_token')}`,
            },
        }
    );
};
export const useCreatePortfolio = () => {
    return useMutation({
        mutationFn: (form: PortfolioFormTypes) => createPortfolio(form),
    });
};

export const useGetMyPortfolios = (filter: Filter) => {
    return useQuery({
        queryKey: ['GET_MY_PORTFOLIOS', filter],
        queryFn: () => getMyPortfolios(filter),
    });
};

export const useGetMyPortfolioDashboardData = (type: string) => {
    return useQuery({
        queryKey: ['GET_MY_PORTFOLIO_DASHBOARD_DATA', type],
        queryFn: () => getMyPortfolioDashboardData(type),
    });
};

export const useDeletePortfolio = () => {
    return useMutation({
        mutationFn: (portfolioId: string) => deletePortfolio(portfolioId),
    });
};

export const useGetPortfolioDetails = (portfolioId: string | null) => {
    return useQuery({
        queryKey: ['GET_PORTFOLIO_DETAILS', portfolioId],
        queryFn: () => getPortfolioDetails(portfolioId || ''),
        enabled: !!portfolioId,
    });
};

export const useDeletePortfolioItem = () => {
    return useMutation({
        mutationFn: ({
            portfolioId,
            portfolioItemId,
        }: {
            portfolioId: string;
            portfolioItemId: string;
        }) => deletePortfolioItem(portfolioId, portfolioItemId),
    });
};
