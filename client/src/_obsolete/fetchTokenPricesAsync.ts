import axios from 'axios';
import produce from 'immer';

import { ApiBurstMetadataAsset } from '../components/Burst/api-burst-metadata-asset';
import { convertToFloat } from '../utils/convertToFloat';
import { CovalentApiPagination } from './covalent-api-pagination';

export interface TokenPrice {
  name: string;
  symbol: string;
  address: string;
  amount: number;
  quote: number;
  logo?: string;
  totalValue: number;
}

export interface TokenPrices {
  byId: {
    [tokenAddress: string]: TokenPrice;
  };
  allIds: string[];
}

const initialObj: TokenPrices = {
  byId: {},
  allIds: [],
};

const normalizeData = ({
  burstAssets,
  tokenPricesByName = {},
}: {
  burstAssets: ApiBurstMetadataAsset[];
  tokenPricesByName: { [tokenName: string]: SpotPriceToken };
}): TokenPrices => {
  // using immer for clarity with immutability
  return produce(initialObj, (draft) => {
    for (let i = 0; i < burstAssets.length; i++) {
      const asset = burstAssets[i];
      // make sure it's lowercase
      const tokenName = asset.token_name?.toLowerCase();
      if (asset.token_address && tokenName) {
        // build default token data object and assign to token address
        const { token_address: address, token_name: name, token_symbol: symbol, token_amount: amount } = asset;
        const token = { name, symbol, address, amount, quote: 0, logo: undefined, totalValue: 0 };

        // default to ether decimals
        token.amount = convertToFloat({ value: amount, decimals: tokenPricesByName[tokenName]?.contract_decimals });
        draft.byId[token.address] = token;

        // if the asset token name is in this trusted data structure then grab the quote_rate
        if (tokenPricesByName[tokenName]) {
          draft.byId[token.address].quote = tokenPricesByName[tokenName].quote_rate || 0;
          draft.byId[token.address].logo = tokenPricesByName[tokenName].logo_url;
          // debugger;
          draft.byId[token.address].totalValue = token.amount * draft.byId[token.address].quote;
        }
        draft.allIds.push(token.address);
      }
    }
  });
};
/*
Expected burstAssets input
{
description: "An NFT that represents ERC20 assets",
image: "https://gateway.pinata.cloud/ipfs/QmfTQTSSUUfhqzjpPvFMhzC2C7UtJUysWzMUu9RHYR2dCL",
name: "Burst NFT",
attributes: [
{
token_address: "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
token_name: "Wrapped AVAX",
token_symbol: "WAVAX",
token_amount: 4654000000000000
},
{
token_address: "0xf4e0a9224e8827de91050b528f34e2f99c82fbf6",
token_name: "Uniswap",
token_symbol: "UNI",
token_amount: 2358340000000000000
}
]
}
*/

/*
Expected RETURN

{
  byId: {
    0xd00ae08403b9bbb9124bb305c09058e32c39a48c: {name:'Wrapped AVAX', symbol:'WAVAX', amount:4654000000000000,address:'0xd00ae08403b9bbb9124bb305c09058e32c39a48c',quote: 0,logo:undefined}, 
    0xf4e0a9224e8827de91050b528f34e2f99c82fbf6:{name:'Uniswap', symbol:'UNI', amount:2358340000000000000,address:'0xf4e0a9224e8827de91050b528f34e2f99c82fbf6',quote:29.10,logo:'https://www.somelogolink.com'}},
  allIds: ['0xd00ae08403b9bbb9124bb305c09058e32c39a48c','0xf4e0a9224e8827de91050b528f34e2f99c82fbf6'],
}
*/

/*
can't use 
      // `https://api.covalenthq.com/v1/pricing/historical_by_addresses/${chainId}/${currency}/${addresses.join()}?key=${
      //   process.env.REACT_APP_COVALENT_API_KEY
      // }`
*/

interface SpotPriceToken {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[] | null;
  logo_url: string;
  quote_rate: number;
  rank: number;
}

interface Data {
  updated_at: Date;
  items: SpotPriceToken[];
  pagination: CovalentApiPagination;
}

interface SpotPricesResponse {
  data: Data;
  error: any;
  error_message: any;
  error_code: any;
}

export const fetchTokenPricesAsync = async ({ burstAssets = [] }: { burstAssets?: ApiBurstMetadataAsset[] }): Promise<TokenPrices> => {
  if (burstAssets?.length) {
    // concat symbols with comma to call spot price api
    const symbols = burstAssets.map((t) => t.token_symbol).join();
    const { data } = await axios.get<SpotPricesResponse>(
      `https://api.covalenthq.com/v1/pricing/tickers/?tickers=${symbols}&key=${process.env.REACT_APP_COVALENT_API_KEY}`
    );

    // grab the items fields or default to empty array so nothing blows up
    const items = data?.data?.items || [];
    // normalize by contract name for fast access later
    const tokenPricesByName = items.reduce<{ [tokenName: string]: SpotPriceToken }>((acc, token) => {
      if (token.contract_name) acc[token.contract_name.toLowerCase()] = token;
      return acc;
    }, {});
    return normalizeData({ burstAssets, tokenPricesByName });
  } else {
    // probably overkill spread operating it
    return { ...initialObj };
  }
};
