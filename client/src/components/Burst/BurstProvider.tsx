import React from 'react';
import { BurstContext, BurstAsset, BurstsState } from './BurstContext';
import { useWallet } from '../Wallet';
import { createBurstContract } from './utils';
import { tokensByChainId } from '../../utils/data/tokens';

export interface BurstProviderProps {
  children: React.ReactNode;
}

export function BurstProvider({ children }: BurstProviderProps) {
  const [bursts, setBursts] = React.useState<BurstsState>({});
  const balance = React.useMemo(() => Object.keys(bursts)?.length || 0, [bursts]);
  const { web3, account, chainId } = useWallet();

  React.useEffect(() => {
    (async () => {
      console.log(account, chainId, chainId && tokensByChainId[chainId]);
      if (account && chainId && tokensByChainId[chainId]) {
        const contract = createBurstContract({ web3, chainId });
        const _balance = await contract.methods.balanceOf(account).call();
        const _bursts: BurstsState = {};
        for (let i = 0; i < Number.parseInt(_balance); i++) {
          const tokenId = await contract.methods.tokenOfOwnerByIndex(account, i).call();
          const nftInfo = await contract.methods.getBurstNftInfo(tokenId).call();

          const assets: BurstAsset[] = nftInfo[0].map((addr: string, idx: number) => ({
            address: addr,
            balance: nftInfo[1][idx],
          }));
          _bursts[tokenId] = { tokenId, assets };
        }

        setBursts(_bursts);
      } else {
        setBursts({});
      }
    })();
  }, [account, web3, chainId]);

  return <BurstContext.Provider children={children} value={{ bursts, balance }} />;
}
