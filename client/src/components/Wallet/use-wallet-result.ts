import { Network } from '../../utils/data/networks';
export interface UseWalletResult {
  account: string;
  chainId: number | undefined;
  network: Network;
  // ethereum: any;
  web3: any;
}
