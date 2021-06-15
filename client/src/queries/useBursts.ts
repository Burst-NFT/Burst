import axios from 'axios';
import { useQuery } from 'react-query';
import { getBurstsAsync, getErc20InfoAsync } from '../api';
import { ApiBurstMetadataAsset, Burst, BurstAsset, BurstContractAsset, BurstContractInfoAndMetadata } from '../components/Burst';
import { useWallet } from '../components/Wallet';
import { abi as ERC20ABI } from '../contracts/ERC20.json';
import { NormalizedData } from '../types';

interface UseBurstResult extends NormalizedData<Burst> {}

function mapMetadataAssetsToBurstAssets(assets: ApiBurstMetadataAsset[] = []): BurstAsset[] {
  return assets.map((value) => ({
    address: value.token_address,
    balance: value.token_balance,
    name: value.token_name,
    symbol: value.token_symbol,
    decimals: value.token_decimals,
    logoUrl: value.token_logo_url,
  }));
}
async function mapContractAssetToBurstAssetAsync({ web3, account, asset }: { web3: any; account: string; asset: BurstAsset }): Promise<BurstAsset> {
  //
  try {
    const contract = new web3.eth.Contract(ERC20ABI, asset.address);
    const erc20Info = await getErc20InfoAsync({ contract, account });
    return {
      address: asset.address,
      name: erc20Info.name,
      symbol: erc20Info.symbol || `${asset.address.slice(0, 6)}...`,
      decimals: erc20Info.decimals,
      balance: asset.balance,
    };
  } catch (err) {
    // do nothing
  }
  return {
    address: asset.address,
    balance: asset.balance,
  };
}
async function mapContractAssetsToBurstAssetsAsync({
  web3,
  account,
  assets = [],
}: {
  assets?: BurstContractAsset[];
  web3: any;
  account: string;
}): Promise<BurstAsset[]> {
  return Promise.all(assets.map((asset) => mapContractAssetToBurstAssetAsync({ web3, account, asset })));
}

async function mapBurstsToResultAsync({
  web3,
  account,
  data,
}: {
  data?: BurstContractInfoAndMetadata[];
  web3: any;
  account: string;
}): Promise<UseBurstResult> {
  const result = <UseBurstResult>{
    byId: {},
    allIds: [],
  };
  if (data?.length) {
    for (let i = 0; i < data.length; i++) {
      const burst = data[i];

      // build the normalized assets object
      // if there wasn't any external metadata fetched then use the contract methods to grab basic info
      const assetsArr = !!burst.metadata?.assets?.length
        ? mapMetadataAssetsToBurstAssets(burst.metadata.assets)
        : await mapContractAssetsToBurstAssetsAsync({ web3, account, assets: burst.assets });

      const assets: NormalizedData<BurstAsset> = {
        byId: {},
        allIds: [],
      };
      for (let i = 0; i < assetsArr.length; i++) {
        const a = assetsArr[i];
        assets.byId[a.address] = a;
        assets.allIds.push(a.address);
      }

      // populate byId
      result.byId[burst.tokenId] = {
        id: burst.tokenId,
        tokenUri: burst.tokenUri,
        logoUrl: burst.metadata?.image,
        assets,
      };

      // populate allIDs
      result.allIds.push(burst.tokenId);
    }
  }

  return result;
}

export function useBursts() {
  const { account, chainId, web3 } = useWallet();
  return useQuery<UseBurstResult>(['bursts', chainId, account], () =>
    getBurstsAsync({ chainId, account, web3 }).then((data) => mapBurstsToResultAsync({ data: data || undefined, web3, account }))
  );
}
