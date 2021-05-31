import axios from 'axios';
import { ApiBurstMetadata, BurstContractInfoAndMetadata } from '../components/Burst';
import { createBurstContract } from '../components/Burst/utils';
import { tokensByChainId } from '../utils/data/tokens';
import { isWellFormedUrl } from '../utils/isWellFormedUrl';

export const getBurstsAsync = async ({
  account,
  chainId,
  web3,
}: {
  account?: string;
  chainId?: number;
  web3: any;
}): Promise<BurstContractInfoAndMetadata[]> => {
  if (account && chainId && tokensByChainId[chainId]) {
    const contract = createBurstContract({ web3, chainId });
    const _balance = await contract.methods.balanceOf(account).call();
    const tasks: Promise<BurstContractInfoAndMetadata>[] = [];
    for (let i = 0; i < Number.parseInt(_balance); i++) {
      tasks.push(getBurstAndMetadataAsync({ contract, index: i, account }));
    }
    return Promise.all(tasks);
  }

  return [];
};

const getBurstAndMetadataAsync = async ({
  contract,
  index,
  account,
}: {
  contract: any;
  index: number;
  account: string;
}): Promise<BurstContractInfoAndMetadata> => {
  const tokenId: string = await contract.methods.tokenOfOwnerByIndex(account, index).call();
  const nftInfo = await contract.methods.getBurstNftInfo(tokenId).call();
  const assets = nftInfo[0].map((addr: string, idx: number) => ({
    address: addr,
    balance: nftInfo[1][idx],
  }));
  const tokenUri = await contract.methods.tokenURI(tokenId).call();
  let metadata = {} as ApiBurstMetadata;

  if (tokenUri && isWellFormedUrl(tokenUri)) {
    ({ data: metadata } = await axios.get<ApiBurstMetadata>(tokenUri));
  }

  return {
    tokenId,
    tokenUri,
    assets,
    metadata,
  };
};
