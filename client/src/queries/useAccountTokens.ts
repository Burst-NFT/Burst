import { useWallet } from '../components/Wallet';
import { useQuery } from 'react-query';
import { TokenTypes } from '../api/token-type.enum';
import { produce } from 'immer';
import { CovalentApiTokenBalance } from '../api';
import { fetchAddressTokensAsync } from '../api/fetchAddressTokensAsync';
import { BigNumber, BigNumberish } from 'ethers';
import { NormalizedData } from '../types';

const allowedTokenTypes = new Set([TokenTypes.crypto, TokenTypes.nft]);

export interface AccountToken {
  /** this will be the same as address */
  id: string;
  address: string;
  balance: BigNumberish;
  decimals: number;
  name?: string;
  symbol?: string;
  logoUrl?: string;
}

interface AccountTokensById {
  [address: string]: AccountToken;
}

interface UseAccountTokensResult extends NormalizedData<AccountToken> {
  byId: AccountTokensById;
  allIds: string[];
  cryptoIds: string[];
  nftIds: string[];
}

const initialData: UseAccountTokensResult = {
  byId: {},
  allIds: [],
  cryptoIds: [],
  nftIds: [],
};

const mapAddressTokenBalancesToResult = (items: CovalentApiTokenBalance[] | undefined = []) => {
  // using immer for clarity with immutability
  const result = produce(initialData, (draft) => {
    for (let i = 0; i < items.length; i++) {
      const token = items[i];
      // if acceptable/preset type, then can add
      if (token.contract_address && allowedTokenTypes.has(token.type as TokenTypes)) {
        draft.byId[token.contract_address] = {
          id: token.contract_address,
          address: token.contract_address,
          balance: BigNumber.from(token.balance),
          decimals: token.contract_decimals,
          name: token.contract_name,
          symbol: token.contract_ticker_symbol,
          logoUrl: token.logo_url,
          // quote: token.quote_rate,
        };
        // set ids
        draft.allIds.push(token.contract_address);
        if (token.type === TokenTypes.crypto) draft.cryptoIds.push(token.contract_address);
        if (token.type === TokenTypes.nft) draft.nftIds.push(token.contract_address);
      }
    }
  });

  return result;
};

export function useAccountTokens() {
  const { account, chainId } = useWallet();
  return useQuery<UseAccountTokensResult>(
    ['tokenbalances', chainId, account],
    () =>
      fetchAddressTokensAsync({ address: account, chainId }).then(({ data }) =>
        mapAddressTokenBalancesToResult(data?.items ? data.items : undefined)
      ),
    {
      placeholderData: initialData,
    }
  );
}
