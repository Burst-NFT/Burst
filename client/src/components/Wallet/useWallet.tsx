import React from 'react';
import WalletContext from './WalletContext';
import { Network, networkByChainId } from '../../utils/data/networks';

export interface UserWallet{
  account: string;
  chainId: number | undefined;
  network: Network;
  ethereum: any;
  web3: any;
}

function useWallet(): UserWallet {
  const { account, chainId, ethereumRef, web3Ref } = React.useContext(WalletContext);

  const network = React.useMemo(() => networkByChainId[chainId], [chainId]);

  return {
    account,
    chainId,
    network,
    get ethereum() {
      return ethereumRef.current;
    },
    get web3() {
      return web3Ref.current;
    },
  };
}

export default useWallet;
