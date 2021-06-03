export interface BasketItem {
  logoUrl?: string;
  name: string;
  symbol: string;
  amount: number;
  decimals: number;
  address: string;
  /**
   * Instantiated erc20 contract
   */
  contract: any;
}

export interface BasketState {
  byId: {
    [address: string]: BasketItem;
  };
  allIds: string[];
}
