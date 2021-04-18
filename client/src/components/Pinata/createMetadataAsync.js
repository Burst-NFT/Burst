import axios from 'axios';
import produce from 'immer';

const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

const pinJSONToIPFSAsync = async (body) => {
  const response = await axios.post(url, body, {
    headers: {
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
    },
  });
  console.log(response.data.IpfsHash);
  return response.data.IpfsHash;
};

const initialBody = {
  pinataMetadata: {
    name: 'Burst NFT JSON',
  },
  pinataContent: {
    description: 'An NFT that represents ERC20 assets',
    image: 'https://gateway.pinata.cloud/ipfs/QmTgep8UJZxkumYWmfNoUYaqej1Fh2pDezxsgfZBa3RqVm',
    name: 'Burst NFT',
    assets: [],
  },
};

const createMetadataAsync = (assets = []) => {
  const postBody = produce(initialBody, (draft) => {
    draft.pinataContent.assets = assets;
  });
  return pinJSONToIPFSAsync(postBody);
};

export default createMetadataAsync;
