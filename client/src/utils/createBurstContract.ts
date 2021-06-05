import { tokensByChainId, BurstNft } from '../data';

export interface CreateBurstContract {
  web3: any;
  chainId?: number;
}
export const createBurstContract = ({ web3, chainId }: CreateBurstContract) => {
  if (chainId && tokensByChainId[chainId]) {
    const token = tokensByChainId[chainId].find((token) => token.symbol === BurstNft.symbol);
    if (token) return new web3.eth.Contract(token.abi, token.address);
  }

  return null;
};
