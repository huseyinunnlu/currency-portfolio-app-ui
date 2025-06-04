import { create } from 'zustand';

import { TITLES_BY_ID } from '@/constants';

type Title = {
    title: string;
};

export interface CommonTypes {
    _id: string;
    type: string;
}

export interface DefinitionTypes extends CommonTypes {
    ISIN: string;
    code: string;
    currency: string;
    domain: string;
    exchange: string;
    expireDate: number;
    issuerName: string;
    legacyCode: string;
    market: string;
    marketSector: string;
    precision: number;
    security: string;
    securityDesc: string;
    securityDescEn: string;
    securityType: string;
    status: 'ACTIVE' | 'INACTIVE';
    ticker: string;
    underlyingSecurity: string;
    unit: string;
    warrantRate: number;
}

export interface FieldTypes extends CommonTypes {
    display: string;
    fxplusId: number;
    name: string;
    shortCode: string;
}

export interface CurrencyData {
    _id: string;
    _s: number;
    _i: string;
    E: string;
    l: number;
    C: number;
    c: number;
    b: number;
    a: number;
    h: number;
    L: number;
    Wh: number;
    Wl: number;
    wp: number;
    Mh: number;
    Ml: number;
    mp: number;
    Yh: number;
    Yl: number;
    yp: number;
}

export type Currency = CurrencyData & DefinitionTypes & Title;

export interface CurrencyState {
    definitions: DefinitionTypes[] | null;
    fields: FieldTypes[] | null;
    currencyData: Currency[] | null;
    favorites: string[];
    setCurrency: (currencyData: CurrencyData[]) => void;
    setDefinitions: (definitions: DefinitionTypes[]) => void;
    setFields: (fields: FieldTypes[]) => void;
    getByCurrency: (keys: string[]) => Currency[] | null;
    toggleFavorite: (currencyId: string) => void;
    formatCurrencyData: (currencyData: CurrencyData[]) => Currency[];
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
    definitions: null,
    fields: null,
    currencyData: null,
    favorites:
        typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('currencyFavorites') || '[]')
            : [],
    setFields: (fields: FieldTypes[]) => set((state) => ({ ...state, fields })),
    setDefinitions: (definitions: DefinitionTypes[]) =>
        set((state) => ({
            ...state,
            definitions,
        })),
    getByCurrency: (keys: string[]) => {
        const state = get();
        if (!state.currencyData) return null;
        if (keys.length === 0 && state.favorites.length > 0) {
            return state.currencyData.filter((currency) => state.favorites.includes(currency._i));
        }
        return state.currencyData.filter((currency) => keys.includes(currency._i));
    },
    toggleFavorite: (currencyId: string) =>
        set((state) => {
            const newFavorites = state.favorites.includes(currencyId)
                ? state.favorites.filter((id) => id !== currencyId)
                : [...state.favorites, currencyId];

            if (typeof window !== 'undefined') {
                localStorage.setItem('currencyFavorites', JSON.stringify(newFavorites));
            }
            return { ...state, favorites: newFavorites };
        }),
    formatCurrencyData: (currencyData: CurrencyData[]) => {
        const state = get();
        const data = currencyData.map((currency) => {
            const definition = state.definitions?.find((def) => def._id === currency._i) || {};

            return {
                ...currency,
                _id: currency._i,
                ...definition,
                title: TITLES_BY_ID[currency._i],
            } as Currency;
        });
        return data;
    },
    setCurrency: (currencyData: CurrencyData[]) =>
        set((state) => {
            const currencyDataIds = currencyData.map((currency) => currency._i);
            const formattedData = get().formatCurrencyData(currencyData);

            return {
                ...state,
                currencyData: [
                    ...(state.currencyData?.filter(
                        (currency) => !currencyDataIds.includes(currency._i)
                    ) || []),
                    ...formattedData,
                ].sort((a, b) => {
                    return a._id.localeCompare(b._id);
                }),
            };
        }),
}));
