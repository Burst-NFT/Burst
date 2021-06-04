import { tokensByChainId, BurstMarketplace } from '../data';

export interface CreateMarketplaceContract {
  web3: any;
  chainId?: number;
}

export const createMarketplaceContract = ({ web3, chainId }: CreateMarketplaceContract) => {
  if (chainId && tokensByChainId[chainId]) {
    const token = tokensByChainId[chainId].find((token) => token.name === BurstMarketplace.name);
    if (token) return new web3.eth.Contract(token.abi, token.address);
  }

  return null;
};
