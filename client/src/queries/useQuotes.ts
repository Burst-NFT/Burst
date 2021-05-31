import { useWallet } from '../components/Wallet';
import { CovalentApiHistoricalPriceItem, fetchPricesByAddressAsync } from '../api/fetchPricesByAddressAsync';
import { useQuery } from 'react-query';

export interface ContractPrice {
  decimals: number;
  name: string;
  symbol: string;
  address: string;
  logoUrl?: string;
  quote?: number;
}

interface ContractById {
  [address: string]: ContractPrice;
}

interface UseQuotesResult {
  byId: ContractById;
  allIds: string[];
}

function mapHistoricalPricesToResult(items: CovalentApiHistoricalPriceItem[] | undefined = []): UseQuotesResult {
  const byId = {} as { [address: string]: ContractPrice };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    byId[item.contract_address] = {
      decimals: item.contract_decimals,
      name: item.contract_name,
      symbol: item.contract_ticker_symbol,
      address: item.contract_address,
      logoUrl: item.logo_url,
      quote: item.prices[0]?.price,
    };
  }

  return {
    byId,
    allIds: Object.keys(byId),
  };
}

export function useQuotes({ addresses = [] }) {
  const { account, chainId } = useWallet();
  // prices are cached, probably should change this or at least make it very greedy
  return useQuery<UseQuotesResult>(['quotes', chainId, account, addresses.join(',')], () =>
    fetchPricesByAddressAsync({ chainId, addresses }).then(({ data = [] }) => mapHistoricalPricesToResult(data ? data : undefined))
  );
}
