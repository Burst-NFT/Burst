import { NormalizedData } from '../../../types';
import { BurstAsset } from './burst-asset';

export interface Burst {
  id: string;
  tokenUri: string;
  logoUrl?: string;
  assets: NormalizedData<BurstAsset>;
}
