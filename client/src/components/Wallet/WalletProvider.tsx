import React from 'react';
import { useMoralis } from 'react-moralis';
import Web3 from 'web3';
import { WalletContext } from './WalletContext';

export interface WalletProviderProps {
  children: React.ReactNode;
}

const ACCOUNT_INITIAL_VALUE = '';
const CHAIN_ID_INITIAL_VALUE = undefined;
const ACCOUNTS_INITIAL_VALUE: string[] = [];

export function WalletProvider({ children }: WalletProviderProps) {
  const { Moralis, isAuthenticated } = useMoralis();
  const web3Ref = React.useRef<any>(null);
  // const ethereumRef = React.useRef<any>(null);
  const [account, setAccount] = React.useState<string>(ACCOUNT_INITIAL_VALUE);
  const [accounts, setAccounts] = React.useState<string[]>(ACCOUNTS_INITIAL_VALUE);
  const [chainId, setChainId] = React.useState<number | undefined>(CHAIN_ID_INITIAL_VALUE);

  // equivalent to component will mount
  if (web3Ref.current == null && (window as any).ethereum) {
    (window as any).web3 = new Web3((window as any).ethereum);

    // ethereumRef.current = (window as any).ethereum;
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
    async (accounts) => {
      console.log('accountsChanged', accounts);
      setAccount(accounts[0]);
      // this works ok, but probably can do more
      await Moralis.Web3.link(accounts[0]);
      setAccounts(accounts);
    },
    [setAccount]
  );

  const connectCallback = React.useCallback(
    ({ chainId }) => {
      // will occur AFTER disconnect issue is resolved
      // console.log('connect', something);
      setChainId(parseInt(chainId));
    },
    [setChainId]
  );

  const disconnectCallback = React.useCallback(() => {
    // will occur when if it becomes unable to submit RPC requests to any chain.
    setChainId(CHAIN_ID_INITIAL_VALUE);
  }, [setChainId]);

  React.useEffect(() => {
    const web3 = web3Ref.current;
    if (web3 != null) {
      (async () => {
        const _accounts = await web3.eth.getAccounts();
        setAccount(_accounts[0]);
        setAccounts(_accounts);
        setChainId(parseInt(web3.currentProvider.chainId));
        web3.currentProvider.on('accountsChanged', accountsChangedCallback);
        web3.currentProvider.on('chainChanged', chainChangedCallback);
        web3.currentProvider.on('disconnect', disconnectCallback);
        web3.currentProvider.on('connect', connectCallback);
      })();
    }

    // clean up
    return () => {
      if (web3?.currentProvider.removeListener) {
        web3.currentProvider.removeListener('chainChanged', chainChangedCallback);
        web3.currentProvider.removeListener('accountsChanged', accountsChangedCallback);
        web3.currentProvider.removeListener('disconnect', disconnectCallback);
        web3.currentProvider.removeListener('connect', connectCallback);
      }
    };
  }, [accountsChangedCallback, chainChangedCallback, connectCallback, disconnectCallback]);

  return <WalletContext.Provider children={children} value={{ web3Ref, account, chainId, accounts }} />;
}
