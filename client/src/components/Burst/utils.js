import { findTokenBySymbol, tokensByChainId } from '../utils';

export const createBurstContract = ({ web3, chainId }) => {
  if (chainId && tokensByChainId[chainId]) {
    const burstToken = tokensByChainId[chainId].find((token) => token.symbol === 'BURST');
    return new web3.eth.Contract(burstToken.abi, burstToken.address);
  }

  return null;
};

export const getBurstAddress = ({ chainId } = {}) => findTokenBySymbol({ chainId, symbol: 'BURST' })?.address?.toLowerCase();
