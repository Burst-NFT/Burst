import { BigNumberish } from '@ethersproject/bignumber';

export interface BurstAsset {
  address: string;
  /**
   * Taking inspiration from Ethers, balance should be always a bignumber
   */
  balance: BigNumberish;
  logoUrl?: string;
  name?: string;
  symbol?: string;
  /**
   * Decimals most likely going to 18 or just a safe number
   */
  decimals?: number;
}
