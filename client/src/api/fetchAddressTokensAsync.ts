import axios from 'axios';
import { CovalentApiTokenBalance, CovalentApiResponse } from '.';

interface CovalentApiAddressTokenBalances {
  address: string;
  updated_at: Date;
  next_update_at: Date;
  quote_currency: 'USD';
  chain_id: number;
  items: CovalentApiTokenBalance[];
  pagination: any;
}

// TODO change to typescript enum

export const fetchAddressTokensAsync = async ({
  address,
  chainId,
}: {
  address?: string;
  chainId?: number;
}): Promise<CovalentApiResponse<CovalentApiAddressTokenBalances>> => {
  if (chainId && address) {
    const { data: response } = await axios.get<CovalentApiResponse<CovalentApiAddressTokenBalances>>(
      `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?nft=true&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENT_API_KEY}`
    );

    return response;
  }

  return {
    error: false,
  };
};
