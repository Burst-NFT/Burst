import { CovalentApiTokenExternalNftData } from '.';

export interface CovalentApiTokenNftData {
  token_id: number;
  token_balance: number;
  token_url: string;
  supports_erc: string[] | null;
  token_price_wei: number | null;
  token_quote_rate_eth: string | null;

  external_data: CovalentApiTokenExternalNftData | null;
  owner: string;
}
