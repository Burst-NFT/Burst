import axios from 'axios';
import { useQuery } from 'react-query';
import { getBurstsAsync } from '../api';
import { ApiBurstMetadataAsset, Burst, BurstAsset, BurstContractAsset, BurstContractInfoAndMetadata } from '../components/Burst';
import { useWallet } from '../components/Wallet';

interface BurstById {
  [tokenId: string]: Burst;
}

interface UseBurstResult {
  byId: BurstById;
  /**
   * Internal token ids
   */
  allIds: string[];
}

function mapMetadataAssetsToBurstAssets(assets: ApiBurstMetadataAsset[] = []): BurstAsset[] {
  return assets.map((value) => ({
    address: value.token_address,
    balance: value.token_amount,
    name: value.token_name,
    symbol: value.token_symbol,
  }));
}

function mapContractAssetsToBurstAssets(assets: BurstContractAsset[] = []): BurstAsset[] {
  return assets.map((value) => ({
    address: value.address,
    balance: value.balance,
  }));
}

function mapBurstsToResult(data: BurstContractInfoAndMetadata[] | undefined): UseBurstResult {
  const result = <UseBurstResult>{
    byId: {},
    allIds: [],
  };
  if (data?.length) {
    for (let i = 0; i < data.length; i++) {
      const burst = data[i];

      // build the normalized assets object
      const assetsArr = !!burst.metadata?.assets?.length
        ? mapMetadataAssetsToBurstAssets(burst.metadata.assets)
        : mapContractAssetsToBurstAssets(burst.assets);

      const assets = {
        byId: {} as { [address: string]: BurstAsset },
        allIds: [] as string[],
      };
      for (let i = 0; i < assetsArr.length; i++) {
        const a = assetsArr[i];
        assets.byId[a.address] = a;
        assets.allIds.push(a.address);
      }

      result.byId[burst.tokenId] = {
        id: burst.tokenId,
        tokenUri: burst.tokenUri,
        logoUrl: burst.metadata?.image,
        assets,
      };
    }
  }

  return result;
}

export function useBursts() {
  const { account, chainId, web3 } = useWallet();
  return useQuery<UseBurstResult>(['bursts', chainId, account], () =>
    getBurstsAsync({ chainId, account, web3 }).then((data) => mapBurstsToResult(data ? data : undefined))
  );
}
