export interface BurstMarketplaceOrder {
  burstTokenId: string;
  maker: string;
  paymentToken: string;
  price: string;
  address: string;
  assets: BurstMarketplaceOrderAsset[];
  assetMetadata: string;
}

export interface BurstMarketplaceOrderAsset {
  burstTokenId: string;
  address: string;
  balance: string;
  name: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
}
