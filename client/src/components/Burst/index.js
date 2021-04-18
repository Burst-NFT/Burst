import React from 'react';
import BurstContext from './BurstContext';
import useWallet from '../Wallet/useWallet';
import { createBurstContract } from './utils';
import { tokensByNetworkId } from '../utils';

function Burst({ children }) {
  const [bursts, setBursts] = React.useState({});
  const balance = React.useMemo(() => Object.keys(bursts)?.length || 0, [
    bursts
  ]);
  const { web3, account, network } = useWallet();
  const networkId = network?.networkId;

  React.useEffect(() => {
    (async () => {
      if (account && networkId && tokensByNetworkId[networkId]) {
        const contract = createBurstContract({ web3, networkId });
        const balance = await contract.methods.balanceOf(account).call();
        const _bursts = {};
        for (let i = 0; i < Number.parseInt(balance); i++) {
          const tokenId = await contract.methods
            .tokenOfOwnerByIndex(account, i)
            .call();
          const nftInfo = await contract.methods
            .getBurstNftInfo(tokenId)
            .call();

          const assets = nftInfo[0].map((addr, idx) => ({
            address: addr,
            balance: nftInfo[1][idx]
          }));
          _bursts[tokenId] = { tokenId, assets };
        }

        setBursts(_bursts);
      } else {
        setBursts({});
      }
    })();
  }, [account, web3, networkId]);

  return (
    <BurstContext.Provider children={children} value={{ bursts, balance }} />
  );
}

export default Burst;