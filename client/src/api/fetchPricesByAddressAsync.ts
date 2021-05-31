import axios from 'axios';
import { CovalentApiResponse } from './covalent-api-response';

export interface CovalentApiHistoricalPriceItemPrice {
  contract_metadata: {
    contract_decimals: number;
    contract_name: string;
    contract_ticker_symbol: string;
    contract_address: string;
    supports_erc: [string];
    logo_url: string;
  };
  date: Date;
  price: number;
}

export interface CovalentApiHistoricalPriceItem {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;

  contract_address: string;

  supports_erc: [string];

  logo_url: string;

  update_at: Date;
  quote_currency: string;
  prices: CovalentApiHistoricalPriceItemPrice[];
}

export const fetchPricesByAddressAsync = async ({
  chainId,
  quoteCurrency = 'USD',
  addresses = [],
}: {
  chainId?: number;
  quoteCurrency?: string;
  addresses: string[];
}): Promise<CovalentApiResponse<CovalentApiHistoricalPriceItem[]>> => {
  if (chainId) {
    const addressesParam = addresses.join(',');
    const { data: response } = await axios.get<CovalentApiResponse<CovalentApiHistoricalPriceItem[]>>(
      `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${chainId}/${quoteCurrency}/${addressesParam}/?key=${process.env.REACT_APP_COVALENT_API_KEY}`
    );

    return response;
  }

  return {
    error: false,
  };
};
