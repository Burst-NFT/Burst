import { useQuery } from 'react-query';
import fetchTokenPrices from '../api/fetchTokenPrices';
import { BurstTokenAttribute } from '../components/Burst/types/api-burst-metadata-asset';

export function useBurstAssetPrices({ burstAssets = [] }: { burstAssets?: BurstTokenAttribute[] }) {
  return useQuery(['spotprices', ...burstAssets.map((asset) => asset.token_name?.toLowerCase())], () => fetchTokenPrices({ burstAssets }));
}
