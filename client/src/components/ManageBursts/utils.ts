import { formatUnits } from '@ethersproject/units';
import { BurstAsset } from '../Burst';
import { ContractPrice } from '../../queries/useQuotes';
import { NormalizedData } from '../../types';

export const getBurstAssetsTotalValue = ({
  priceQuotesById = {},
  burstAssets = { byId: {}, allIds: [] },
}: {
  priceQuotesById: {
    [key: string]: ContractPrice;
  };
  burstAssets: NormalizedData<BurstAsset>;
}): number => {
  return burstAssets.allIds.reduce<number>((sum: number, addr: string) => {
    const quote = priceQuotesById[addr]?.quote || 0;
    const burstAsset = burstAssets.byId[addr];
    const balance = burstAsset?.balance;
    if (balance) {
      sum += quote * parseFloat(formatUnits(balance, burstAsset?.decimals));
    }
    return sum;
  }, 0);
};
