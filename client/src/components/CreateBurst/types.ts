import { BigNumberish } from '@ethersproject/bignumber';
export interface BasketItem {
  logo?: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  address: string;
  total: number;
  contract: any;
}

export interface BasketState {
  byId: {
    [address: string]: BasketItem;
  };
  allIds: string[];
}
