import useWallet from './Wallet/useWallet';
import { useQuery } from 'react-query';
import fetchAccountTokens from '../api/fetchAccountTokens';
import fetchSpotPrices from '../api/fetchSpotPrices';

function useAccountTokens() {
  const { account, chainId } = useWallet();
  return useQuery(['tokenbalances', chainId, account], () => fetchAccountTokens({ account, chainId }));
}

function useNftTokensWithValue({ addresses = [] }) {
  const { account, chainId } = useWallet();
  return useQuery(['spotprices', chainId, account], async () => {
    const tokens = await fetchAccountTokens({ account, chainId });
    return { byId: {}, allIds: [] };
  });
}

export { useAccountTokens, useNftTokensWithValue };
