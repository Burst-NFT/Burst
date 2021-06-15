import axios from 'axios';
import { CovalentApiTokenBalance } from '.';

interface CovalentApiAddressTokenBalances {
  address: string;
  updated_at: Date;
  next_update_at: Date;
  quote_currency: 'USD';
  chain_id: number;
  items: CovalentApiTokenBalance[];
  pagination: any;
}

interface CovalentApiAddressTokenBalancesResponse {
  data?: CovalentApiAddressTokenBalances;
  error: boolean;
  error_message?: string | null;
  error_code?: number | null;
}

// TODO change to typescript enum

export const fetchAddressTokensAsync = async ({
  address,
  chainId,
}: {
  address?: string;
  chainId?: number;
}): Promise<CovalentApiAddressTokenBalancesResponse> => {
  if (chainId && address) {
    const { data: response } = await axios.get<CovalentApiAddressTokenBalancesResponse>(
      `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=true&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENT_API_KEY}`
    );

    return response;
  }

  return {
    error: false,
  };
};
