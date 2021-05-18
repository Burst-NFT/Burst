import { findTokenBySymbol, tokensByChainId } from '../../utils/data/tokens';

export interface BurstCreationData {
  web3: any;
  chainId: number | undefined;
}
export const createBurstContract = ({ web3, chainId }: BurstCreationData) => {
  if (chainId && tokensByChainId[chainId]) {
    const burstToken = tokensByChainId[chainId].find((token) => token.symbol === 'BURST');
    if (burstToken) return new web3.eth.Contract(burstToken.abi, burstToken.address);
  }

  return null;
};

export const getBurstAddress = ({ chainId }: { chainId?: number } = {}) => findTokenBySymbol({ chainId, symbol: 'BURST' })?.address?.toLowerCase();
