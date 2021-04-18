import React from 'react';
import Web3 from 'web3';
import WalletContext from './WalletContext';

function Wallet({ children }) {
  const web3Ref = React.useRef(null);
  const ethereumRef = React.useRef(null);
  const [account, setAccount] = React.useState('');
  const [chainId, setChainId] = React.useState(undefined);

  // equivalent to component will mount
  if (web3Ref.current == null && window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    ethereumRef.current = window.ethereum;
    web3Ref.current = window.web3;
  }

  // callbacks
  const chainChangedCallback = React.useCallback(
    (chainId) => {
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
