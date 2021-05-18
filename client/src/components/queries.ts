import useWallet from './Wallet/useWallet';
import { useQuery } from 'react-query';
import fetchAccountTokens from '../api/fetchAccountTokens';
import fetchTokenPrices from '../api/fetchTokenPrices';
import { BurstTokenAttribute } from './Burst/burst-token-attribute';

function useAccountTokens() {
  const { account, chainId } = useWallet();
  return useQuery(['tokenbalances', chainId, account], () => fetchAccountTokens({ account, chainId }));
}

function useBurstAssetPrices({ burstAssets = [] }: { burstAssets?: BurstTokenAttribute[] }) {
  return useQuery(['spotprices', ...burstAssets.map((asset) => asset.token_name?.toLowerCase())], () => fetchTokenPrices({ burstAssets }));
}

export { useAccountTokens, useBurstAssetPrices };
