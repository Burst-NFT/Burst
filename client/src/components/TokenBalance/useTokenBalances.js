import React from 'react';
import useWallet from '../Wallet/useWallet';
import axios from 'axios';
import { useQuery } from 'react-query';
import produce from 'immer';

const initialObj = {
  byId: {},
  allIds: [],
  cryptoIds: [],
  nftIds: []
};

const allowedTokenTypes = new Set(['cryptocurrency', 'nft']);

const normalizeData = ({ items = [] }) => {
  // using immer for clarity with immutability
  return produce(initialObj, (draft) => {
    for (let i = 0; i < items.length; i++) {
      const token = items[i];
      // if acceptable/preset type, then can add
      if (token.contract_address && allowedTokenTypes.has(token.type)) {
        draft.byId[token.contract_address] = token;
        // set ids
        draft.allIds.push(token.contract_address);
        if (token.type === 'cryptocurrency')
          draft.cryptoIds.push(token.contract_address);
        if (token.type === 'nft') draft.nftIds.push(token.contract_address);
      }
    }
  });
};

function useTokenBalances() {
  const { account, network } = useWallet();
  const networkId = network?.networkId;

  return useQuery(['tokenbalances', networkId, account], async () => {
    if (networkId && account) {
      const { data } = await axios.get(
        // `https://api.covalenthq.com/v1/pricing/historical_by_address/${networkId}/USD/${account}/?key=${process.env.COVALENT_API_KEY}`
        `https://api.covalenthq.com/v1/${networkId}/address/${account}/balances_v2/?nft=true&no-nft-fetch=true&key=${process.env.COVALENT_API_KEY}`
      );
      // console.log(data);
      return normalizeData(data?.data);
    } else {
      // probably overkill spread operating it
      return { ...initialObj };
    }
  });
}

export default useTokenBalances;
