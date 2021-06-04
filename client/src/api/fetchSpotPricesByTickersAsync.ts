import axios from 'axios';
import { CovalentApiResponse } from '.';

export interface CovalentApiSpotPriceItem {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;

  contract_address: string;

  supports_erc?: string[];

  logo_url: string;

  quote_rate: number;
  rank: number;
}

export const fetchSpotPricesByTickersAsync = async ({
  chainId,
  symbols = [],
}: {
  chainId?: number;
  symbols: string[];
}): Promise<CovalentApiResponse<CovalentApiSpotPriceItem[]>> => {
  if (chainId && symbols?.length) {
    const symbolsParam = symbols.join(',');
    const { data: response } = await axios.get<CovalentApiResponse<CovalentApiSpotPriceItem[]>>(
      `https://api.covalenthq.com/v1/pricing/tickers/?tickers=${symbolsParam}&key=${process.env.REACT_APP_COVALENT_API_KEY}`
    );

    return response;
  }

  return {
    error: false,
  };
};
