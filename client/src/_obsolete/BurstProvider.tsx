import React from 'react';
import { BurstById, BurstContext } from './BurstContext';
import { useWallet } from '../Wallet';
import { createBurstContract } from './utils';
import { tokensByChainId } from '../../utils/data/tokens';
import { Burst } from './burst';
import { BurstAsset } from './burst-asset';

export interface BurstProviderProps {
  children: React.ReactNode;
}

export function BurstProvider({ children }: BurstProviderProps) {
  const [burstById, setBurstById] = React.useState<BurstById>({});
  const [burstAllIds, setBurstAllIds] = React.useState<string[]>([]);
  const [balance, setBalance] = React.useState<number>(0);
  // const balance = React.useMemo(() => Object.keys(bursts)?.length || 0, [bursts]);
  const { web3, account, chainId } = useWallet();

  React.useEffect(() => {
    (async () => {
      console.log(account, chainId, chainId && tokensByChainId[chainId]);
      if (account && chainId && tokensByChainId[chainId]) {
        const contract = createBurstContract({ web3, chainId });
        const _balance = await contract.methods.balanceOf(account).call();
        const _burstById = {} as BurstById;
        for (let i = 0; i < Number.parseInt(_balance); i++) {
          const tokenId: string = await contract.methods.tokenOfOwnerByIndex(account, i).call();
          const nftInfo = await contract.methods.getBurstNftInfo(tokenId).call();

          const assets: BurstAsset[] = nftInfo[0].map((addr: string, idx: number) => ({
            address: addr,
            balance: nftInfo[1][idx],
          }));
          _burstById[tokenId] = { burstId: tokenId, assets };
        }

        setBurstById(_burstById);
        setBurstAllIds(Object.keys(_burstById));
        setBalance(_balance);
      } else {
        setBurstById({});
        setBurstAllIds([]);
        setBalance(0);
      }
    })();
  }, [account, web3, chainId]);

  return <BurstContext.Provider children={children} value={{ byId: burstById, allIds: burstAllIds, balance }} />;
}
