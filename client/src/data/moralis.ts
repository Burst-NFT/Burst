import { ApiBurstMetadataAsset } from '../components/Burst';

export const tables = {
  burstMarketplaceOrder: 'BurstMarketplaceOrder',
  burstAsset: 'BurstAsset',
};

export interface MoralisBurstAssetRecord {
  isInMarketplace: boolean;
  burstTokenId: string;
  address: string;
  balance: string;
  name: string;
  symbol?: string;
  logoUrl?: string;
  decimals: number;
}

export const mapApiBurstMetadataAsset = ({
  burstTokenId,
  tokenAsset,
}: {
  burstTokenId: string;
  tokenAsset: ApiBurstMetadataAsset;
}): MoralisBurstAssetRecord => {
  return {
    burstTokenId,
    address: tokenAsset.token_address,
    balance: tokenAsset.token_balance,
    name: tokenAsset.token_name,
    symbol: tokenAsset.token_symbol,
    logoUrl: tokenAsset.token_logo_url,
    decimals: tokenAsset.token_decimals,
    isInMarketplace: false,
  };
};

export interface MoralisBurstMarketplaceOrderRecord {
  maker: string;
  tokenId: string;
  price: string;
  paymentToken: string;
  address: string;
}

export interface MoralisMarketplaceOrderCreatedEventObjectAttributes {
  block_timestamp: any;
  transaction_hash: string;
  log_index: number;
  block_hash: string;
  block_number: number;
  transaction_index: number;
  createdAt: Date;
  updatedAt: Date;

  // custom event details
  maker: string;
  tokenId: string;
  price: string;
  paymentToken: string;
  address: string;
}

export interface MoralisParseObject<T> {
  className: string;
  id: string; // objectId

  attributes: T;
  createdAt: Date;
  updatedAt: Date;
}
