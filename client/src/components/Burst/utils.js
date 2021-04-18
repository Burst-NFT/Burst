import { tokensByNetworkId } from '../utils';

export const createBurstContract = ({ web3, networkId }) => {
  if (networkId && tokensByNetworkId[networkId]) {
    const burstToken = tokensByNetworkId[networkId].find((token) => token.symbol === 'BURST');
    return new web3.eth.Contract(burstToken.abi, burstToken.address);
  }

  return null;
};

export const getBurstAddress = ({ networkId } = {}) => {
  if (networkId && tokensByNetworkId[networkId]) {
    return tokensByNetworkId[networkId].find((token) => token.symbol === 'BURST')?.address?.toLowerCase(); // to match with covalent
  }
};
