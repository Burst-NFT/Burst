import React from 'react';
import { WalletContext } from './WalletContext';
import { networkByChainId } from '../../utils/data/networks';
import { UseWalletResult } from './use-wallet-result';

export function useWallet(): UseWalletResult {
  const { account, chainId, web3Ref } = React.useContext(WalletContext);

  const network = React.useMemo(() => networkByChainId[chainId], [chainId]);

  return {
    account,
    chainId,
    network,
    get web3() {
      return web3Ref.current;
    },
  };
}
