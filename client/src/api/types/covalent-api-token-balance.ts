import { CovalentApiTokenNftData } from '.';

export interface CovalentApiTokenBalance {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[] | null;
  logo_url: string;
  type: string;
  balance: string;
  quote_rate: number;
  quote: number;
  nft_data: CovalentApiTokenNftData[] | null;
}
