import { abi as ERC20ABI } from '../contracts/ERC20.json';
import { BurstNft, BurstMarketplace } from './tokenInfo';
import { networkByKey } from './networks';

const basicBurstNftData = {
  name: BurstNft.name,
  symbol: BurstNft.symbol,
  decimals: BurstNft.decimals,
  abi: BurstNft.contractJson.abi,
};

const basicBurstMarketplaceData = {
  name: BurstMarketplace.name,
  symbol: BurstMarketplace.symbol,
  decimals: BurstMarketplace.decimals,
  abi: BurstMarketplace.contractJson.abi,
};

export interface Token {
  address: string;
  name: string;
  symbol?: string;
  decimals: number;
  abi: any;
  networkId: number;
  chainId: number;
}

export interface ContractNetwork {
  events: any;
  links: any;
  address: string;
  transactionHash: string;
}

export interface ContractNetworks {
  [networkId: string]: ContractNetwork;
}

const tokensByChainId: { [id: number]: Token[] } = {
  [networkByKey.avalancheFujiCChain.chainId]: [
    {
      ...basicBurstNftData,
      address: '0x85CFE8b56f6E76F6c694279e3eFd0Efd4Da84863',
      networkId: networkByKey.avalancheFujiCChain.networkId,
      chainId: networkByKey.avalancheFujiCChain.chainId,
    },
  ],
  [networkByKey.ganache.chainId]: [
    {
      ...basicBurstNftData,
      address: (BurstNft.contractJson.networks as ContractNetworks)[`${networkByKey.ganache.networkId}`].address,
      networkId: networkByKey.ganache.networkId,
      chainId: networkByKey.ganache.chainId,
    },
    {
      ...basicBurstMarketplaceData,
      address: (BurstMarketplace.contractJson.networks as ContractNetworks)[`${networkByKey.ganache.networkId}`].address,
      networkId: networkByKey.ganache.networkId,
      chainId: networkByKey.ganache.chainId,
    },
  ],
  [networkByKey.maticMumbaiTestnet.chainId]: [
    {
      ...basicBurstNftData,
      address: '0xF6cad50Aea13C607C53a063EE059B5f6f5d6F86D',
      networkId: networkByKey.maticMumbaiTestnet.networkId,
      chainId: networkByKey.maticMumbaiTestnet.chainId,
    },
  ],
  [networkByKey.mainNet.chainId]: [
    {
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
      name: 'Maker',
      symbol: 'MKR',
      decimals: 18,
      abi: ERC20ABI,
      networkId: networkByKey.mainNet.networkId,
      chainId: networkByKey.mainNet.chainId,
    },
    {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      abi: ERC20ABI,
      networkId: networkByKey.mainNet.networkId,
      chainId: networkByKey.mainNet.chainId,
    },
  ],
  [networkByKey.rinkeby.chainId]: [
    {
      address: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
      symbol: 'DAI',
      name: 'Dai',
      decimals: 18,
      abi: ERC20ABI,
      networkId: networkByKey.rinkeby.networkId,
      chainId: networkByKey.rinkeby.chainId,
    },
    {
      address: '0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85',
      symbol: 'MKR',
      name: 'Maker',
      decimals: 18,
      abi: ERC20ABI,
      networkId: networkByKey.rinkeby.networkId,
      chainId: networkByKey.rinkeby.chainId,
    },
  ],
};

// TODO: Change to a single reduce function for better performance
// Builds an object to access the token by address
const tokenByAddress = Object.values(tokensByChainId)
  .flat()
  .reduce<{ [address: string]: Token }>((acc, token) => {
    acc[token.address] = token;
    return acc;
  }, {});

/**
 * Find the first token matching the symbol
 */
const findTokenBySymbol = ({ chainId, symbol }: { chainId: number | undefined; symbol: string }) => {
  if (chainId && tokensByChainId[chainId]) {
    const token = tokensByChainId[chainId].find((_token) => _token.symbol === symbol);
    return token;
  }

  return undefined;
};

export { tokenByAddress, findTokenBySymbol, tokensByChainId };
