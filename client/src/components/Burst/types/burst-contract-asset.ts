import { BigNumberish } from '@ethersproject/bignumber';

export interface BurstContractAsset {
  address: string;
  balance: BigNumberish;
}
