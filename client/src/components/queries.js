import useWallet from './Wallet/useWallet';
import { useQuery } from 'react-query';
import fetchAccountTokens from '../api/fetchAccountTokens';
import fetchTokenPrices from '../api/fetchTokenPrices';

function useAccountTokens() {
  const { account, chainId } = useWallet();
  return useQuery(['tokenbalances', chainId, account], () => fetchAccountTokens({ account, chainId }));
}

function useBurstAssets({ assets = [] }) {
  return useQuery(['spotprices', ...assets.map((asset) => asset.token_name?.toLowerCase())], () => fetchTokenPrices({ burstAssets: assets }));
}

export { useAccountTokens, useBurstAssets };
