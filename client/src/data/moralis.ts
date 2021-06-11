import { ApiBurstMetadataAsset } from '../components/Burst';

export const tables = {
  marketplaceOrderCreatedEvents: 'MarketplaceOrderCreatedEvents',
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
