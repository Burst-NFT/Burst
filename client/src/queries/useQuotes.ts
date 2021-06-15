import { useWallet } from '../components/Wallet';
import { CovalentApiHistoricalPriceItem, fetchPricesByAddressAsync } from '../api/fetchPricesByAddressAsync';
import { useQuery, UseQueryOptions } from 'react-query';
import { NormalizedData } from '../types';

export interface ContractPrice {
  decimals: number;
  name: string;
  symbol: string;
  address: string;
  logoUrl?: string;
  quote?: number;
}

export interface UseQuotesResult extends NormalizedData<ContractPrice> {
  idBySymbol: { [symbol: string]: string };
}

function mapHistoricalPricesToResult(items: CovalentApiHistoricalPriceItem[] | undefined = []): UseQuotesResult {
  const result: UseQuotesResult = {
    byId: {},
    allIds: [],
    idBySymbol: {},
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    result.byId[item.contract_address] = {
      decimals: item.contract_decimals,
      name: item.contract_name,
      symbol: item.contract_ticker_symbol,
      address: item.contract_address,
      logoUrl: item.logo_url,
      quote: item.prices[0]?.price,
    };
    result.allIds.push(item.contract_address);
    result.idBySymbol[item.contract_ticker_symbol] = item.contract_address;
  }

  return result;
}

export function useQuotes({ addresses = [], options = undefined }: { addresses?: string[]; options?: UseQueryOptions<UseQuotesResult> }) {
  const { account, chainId } = useWallet();
  // prices are cached, probably should change this or at least make it very greedy
  return useQuery<UseQuotesResult>(
    ['quotes', chainId, account, addresses.join(',')],
    () => fetchPricesByAddressAsync({ chainId, addresses }).then(({ data }) => mapHistoricalPricesToResult(data?.items || undefined)),
    options
  );
}
