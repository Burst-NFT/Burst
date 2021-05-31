import { ApiBurstMetadata, BurstContractAsset } from '.';

export interface BurstContractInfoAndMetadata {
  /**
   * Internal id
   */
  tokenId: string;
  tokenUri: string;
  assets: BurstContractAsset[];
  metadata?: ApiBurstMetadata;
}
