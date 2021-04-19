import axios from 'axios';
import produce from 'immer';

const initialObj = {
  byId: {},
  allIds: [],
  cryptoIds: [],
  nftIds: [],
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
        if (token.type === 'cryptocurrency') draft.cryptoIds.push(token.contract_address);
        if (token.type === 'nft') draft.nftIds.push(token.contract_address);
      }
    }
  });
};

const fetchAccountTokens = async ({ account, chainId }) => {
  if (chainId && account) {
    const { data } = await axios.get(
      `https://api.covalenthq.com/v1/${chainId}/address/${account}/balances_v2/?nft=true&no-nft-fetch=true&key=${process.env.REACT_APP_COVALENT_API_KEY}`
    );
    // console.log(data);
    return normalizeData(data?.data);
  } else {
    // probably overkill spread operating it
    return { ...initialObj };
  }
};

export default fetchAccountTokens;
