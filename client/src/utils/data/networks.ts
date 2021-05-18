export interface Network {
  key: string;
  networkId: number;
  name: string;
  chainId: number;
}

const networkByKey: { [id: string]: Network } = {
  mainNet: {
    key: 'mainNet',
    networkId: 1,
    name: 'MainNet',
    chainId: 1,
  },
  ropsten: {
    key: 'ropsten',
    networkId: 3,
    name: 'Ropsten',
    chainId: 3,
  },
  rinkeby: {
    key: 'rinkeby',
    networkId: 4,
    name: 'Rinkeby',
    chainId: 4,
  },
  goerli: {
    key: 'goerli',
    networkId: 5,
    name: 'Goerli',
    chainId: 5,
  },
  kovan: {
    key: 'kovan',
    networkId: 42,
    name: 'Kovan',
    chainId: 42,
  },
  maticMainnet: {
    key: 'maticMainnet',
    networkId: 137,
    name: 'Matic Mainnet',
    chainId: 137,
  },
  maticMumbaiTestnet: {
    key: 'maticMumbaiTestnet',
    networkId: 80001,
    name: 'Matic Mumbai Testnet',
    chainId: 80001,
  },
  ganache: {
    key: 'ganache',
    networkId: 5777,
    name: 'Ganache',
    chainId: 1337,
  },
  avalancheCChainMainnet: {
    key: 'avalancheCChainMainnet',
    networkId: 1,
    name: 'Avalanche C-Chain Mainnet',
    chainId: 43114,
  },
  avalancheFujiCChain: {
    key: 'avalancheFujiCChain',
    networkId: 1,
    name: 'Avalanche FUJI C-Chain',
    chainId: 43113,
  },
};

export interface NetworkByChain {
  [id: number]: Network;
}

const networkByChainId = Object.keys(networkByKey).reduce<NetworkByChain>((acc, key) => {
  acc[networkByKey[key].chainId] = networkByKey[key];
  return acc;
}, {});

export { networkByKey, networkByChainId };
