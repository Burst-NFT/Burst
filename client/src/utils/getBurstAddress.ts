import { findTokenBySymbol, BurstNft } from '../data';

export const getBurstAddress = ({ chainId }: { chainId?: number } = {}) =>
  findTokenBySymbol({ chainId, symbol: BurstNft.symbol as string })?.address?.toLowerCase();
