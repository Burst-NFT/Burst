import { formatUnits } from '@ethersproject/units';
import { BurstAsset } from '../Burst';
import { ContractPrice } from '../../queries/useQuotes';
import { NormalizedData } from '../../types';
import { BurstMarketplaceOrderAsset } from '.';

export const getBurstAssetsTotalValue = ({
  priceQuotesById = {},
  burstAssets = [],
}: {
  priceQuotesById: {
    [key: string]: ContractPrice;
  };
  burstAssets: BurstMarketplaceOrderAsset[];
}): number => {
  return burstAssets.reduce<number>((sum: number, asset: BurstMarketplaceOrderAsset) => {
    const quote = priceQuotesById[asset.address]?.quote || 0;
    const balance = asset?.balance;
    if (balance) {
      sum += quote * parseFloat(formatUnits(balance, asset?.decimals));
    }
    return sum;
  }, 0);
};
