import React from 'react';

export interface WalletContextState {
  account: string;
  accounts: string[];
  chainId: any;
  web3Ref: any | null;
}

export const WalletContext = React.createContext<WalletContextState>({
  account: '',
  accounts: [],
  chainId: '',
  web3Ref: null
});
WalletContext.displayName = 'Wallet';