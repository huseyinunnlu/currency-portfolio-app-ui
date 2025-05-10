import { Dispatch, SetStateAction } from 'react';

export type ActiveTabType = 'currency' | 'gold' | 'favorites';

export interface CurrencyTablePropTypes {
    activeTab: ActiveTabType;
    setActiveTab: Dispatch<SetStateAction<ActiveTabType>>;
}
