import React from 'react';
import Web3 from 'web3';
import WalletContext, { WalletContextState} from './WalletContext';

export interface WalletProps {
  children: React.ReactChildren;
};

function Wallet({ children }: WalletProps) {
  const web3Ref = React.useRef<any>(null);
  const ethereumRef = React.useRef<any>(null);
  const [account, setAccount] = React.useState<string>('');
  const [chainId, setChainId] = React.useState<number | undefined>(undefined);

  // equivalent to component will mount
  if (web3Ref.current == null && (window as any).ethereum) {
    (window as any).web3 = new Web3((window as any).ethereum);
    ethereumRef.current = (window as any).ethereum;
    web3Ref.current = (window as any).web3;
  }

  // callbacks
  const chainChangedCallback = React.useCallback(
    (chainId: string) => {
      console.log('chainChanged', chainId);
      // comes in as a hex string
      setChainId(parseInt(chainId));
    },
    [setChainId]
  );
  const accountsChangedCallback = React.useCallback(
    (accounts) => {
      console.log('accountsChanged', accounts);
      setAccount(accounts[0]);
    },
    [setAccount]
  );

  React.useEffect(() => {
    if (ethereumRef.current != null) {
      setAccount(ethereumRef.current.selectedAddress);
      setChainId(parseInt(ethereumRef.current.chainId));
      ethereumRef.current.on('accountsChanged', accountsChangedCallback);
      ethereumRef.current.on('chainChanged', chainChangedCallback);
    }

    // clean up
    return () => {
      if (ethereumRef?.current?.removeListener) {
        ethereumRef.current.removeListener('chainChanged', chainChangedCallback);
        ethereumRef.current.removeListener('accountsChanged', accountsChangedCallback);
      }
    };
  }, [accountsChangedCallback, chainChangedCallback]);

  return <WalletContext.Provider children={children} value={{ web3Ref, ethereumRef, account, chainId }} />;
}

export default Wallet;
