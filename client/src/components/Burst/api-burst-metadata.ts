import { ApiBurstMetadataAsset } from '.';

export interface ApiBurstMetadata {
  description: string;
  image: string;
  name: string;
  assets: ApiBurstMetadataAsset[];
}
