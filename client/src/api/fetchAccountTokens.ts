import axios from 'axios';
import produce from 'immer';
interface GetTokenBalancesForAddressResponse {
  data: Data;
  error: any;
  error_message: any;
  error_code: any;
}

export interface NftDataExternalData {
  name: string;
  description: string;
  image: string | null;
  external_url: string | null;
  attributes: any[] | null;
}

export interface NftData {
  token_id: number;
  token_balance: number;
  token_url: string;
  supports_erc: string[] | null;
  token_price_wei: number | null;
  token_quote_rate_eth: string | null;

  external_data: NftDataExternalData | null;
  owner: string;
}

export interface TokenBalance {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[] | null;
  logo_url: string;
  type: string;
  balance: string;
  quote_rate: number;
  quote: number;
  nft_data: NftData[] | null;
}
interface Data {
  address: string;
  updated_at: Date;
  next_update_at: Date;
  quote_currency: 'USD';
  chain_id: number;
  items: TokenBalance[];
  pagination: any;
}

export interface AccountTokens {
  byId: {
    [tokenAddress: string]: TokenBalance;
  };
  allIds: string[];
  cryptoIds: string[];
  nftIds: string[];
}

const initialObj: AccountTokens = {
  byId: {},
  allIds: [],
  cryptoIds: [],
  nftIds: [],
};

// TODO change to typescript enum
const allowedTokenTypes = new Set(['cryptocurrency', 'nft']);

const normalizeData = ({ items = [] }: { items: TokenBalance[] }) => {
  // using immer for clarity with immutability
  const normalized = produce(initialObj, (draft) => {
    for (let i = 0; i < items.length; i++) {
      const token = items[i];
      // if acceptable/preset type, then can add
      if (token.contract_address && allowedTokenTypes.has(token.type)) {
        draft.byId[token.contract_address] = token;
        // set ids
        draft.allIds.push(token.contract_address);
        if (token.type === 'cryptocurrency') draft.cryptoIds.push(token.contract_address);
        if (token.type === 'nft') draft.nftIds.push(token.contract_address);
      }
    }
  });

  // console.log('normalizeData', items, normalized);

  return normalized;
};

const fetchAccountTokens = async ({ account, chainId }: { account?: string; chainId?: number }): Promise<AccountTokens> => {
  if (chainId && account) {
    const { data } = await axios.get<GetTokenBalancesForAddressResponse>(
      `https://api.covalenthq.com/v1/${chainId}/address/${account}/balances_v2/?nft=true&no-nft-fetch=false&key=${process.env.REACT_APP_COVALENT_API_KEY}`
    );

    const items = data?.data?.items || [];
    return normalizeData({ items });
  } else {
    // probably overkill spread operating it
    return { ...initialObj };
  }
};

export default fetchAccountTokens;
