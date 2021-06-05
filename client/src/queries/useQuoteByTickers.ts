import { useWallet } from '../components/Wallet';
import { useQuery, UseQueryOptions } from 'react-query';
import { CovalentApiSpotPriceItem, fetchSpotPricesByTickersAsync } from '../api/fetchSpotPricesByTickersAsync';

export interface TickerQuote {
  decimals: number;
  name: string;
  symbol: string;
  address: string;
  logoUrl?: string;
  quote?: number;
}

export interface TickerQuoteById {
  [address: string]: TickerQuote;
}

export interface UseQuoteByTickersResult {
  byId: TickerQuoteById;
  allIds: string[];
  allAddresses: string[];
}

function mapSpotPricesToResult(items: CovalentApiSpotPriceItem[] | undefined = []): UseQuoteByTickersResult {
  const result = {
    byId: {},
    allIds: [],
    allAddresses: [],
  } as UseQuoteByTickersResult;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    result.byId[item.contract_ticker_symbol] = {
      decimals: item.contract_decimals,
      name: item.contract_name,
      symbol: item.contract_ticker_symbol,
      address: item.contract_address,
      logoUrl: item.logo_url,
      quote: item.quote_rate,
    };
    result.allIds.push(item.contract_ticker_symbol);
    result.allAddresses.push(item.contract_address);
  }

  return result;
}

export function useQuoteByTickers({ symbols = [], options = undefined }: { symbols?: string[]; options?: UseQueryOptions<UseQuoteByTickersResult> }) {
  const { account, chainId } = useWallet();
  // prices are cached, probably should change this or at least make it very greedy
  return useQuery<UseQuoteByTickersResult>(
    ['quotes-by-tickers', chainId, account, symbols.join(',')],
    () => fetchSpotPricesByTickersAsync({ chainId, symbols }).then(({ data = [] }) => mapSpotPricesToResult(data ? data : undefined)),
    options
  );
}
