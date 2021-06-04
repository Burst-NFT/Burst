import BurstNFTJson from '../contracts/BurstNFT.json';
import BurstMarketplaceJson from '../contracts/BurstMarketPlace.json';

interface TokenInfo {
  name: string;
  symbol?: string;
  address?: string;
  logoUrl?: string;
  decimals: number;
  contractJson?: any;
}

export const Ether: TokenInfo = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  logoUrl: 'https://logos.covalenthq.com/tokens/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png',
};

export const BurstNft: TokenInfo = {
  name: 'Burst NFT',
  symbol: 'BURST',
  decimals: 18,
  contractJson: BurstNFTJson,
};

export const BurstMarketplace: TokenInfo = {
  name: 'Burst Marketplace',
  decimals: 0,
  contractJson: BurstMarketplaceJson,
};
