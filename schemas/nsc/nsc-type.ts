
export type StockValue = {
    datetime: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume?: string;
};
export type MetaData = {
    symbol: string;
    currency?: string;
    currency_base?: string;
    currency_quote?: string;
    exchange?: string;
    exchange_timezone?: string;
    type: string;
};

export type SymbolData = {
    meta: MetaData;
    values: StockValue[];
    status: string;
};