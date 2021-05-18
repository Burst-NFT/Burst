import React from 'react';

export interface WalletContextState {
  account: string;
  chainId: any;

  web3Ref: any | null;
  ethereumRef: any | null;
}

const WalletContext = React.createContext<WalletContextState>({
  account: '',
  chainId: '',
  web3Ref: null,
  ethereumRef: null
});
WalletContext.displayName = 'Wallet';
export default WalletContext;
