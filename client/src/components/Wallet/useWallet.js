import React from 'react';
import WalletContext from './WalletContext';
import { networkByChainId } from '../utils';

function useWallet() {
  const { account, chainId, ethereumRef, web3Ref } = React.useContext(
    WalletContext
  );

  const network = React.useMemo(() => networkByChainId[chainId], [chainId]);

  return {
    account,
    network,
    get ethereum() {
      return ethereumRef.current;
    },
    get web3() {
      return web3Ref.current;
    }
  };
}

export default useWallet;
