import axios from 'axios';
import produce from 'immer';

const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
const config = {
  headers: {
    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
  },
};

const initialBody = {
  pinataMetadata: {
    name: 'Burst NFT JSON',
  },
  pinataContent: {
    description: 'An NFT that represents ERC20 assets',
    image: 'https://gateway.pinata.cloud/ipfs/QmTgep8UJZxkumYWmfNoUYaqej1Fh2pDezxsgfZBa3RqVm',
    name: 'Burst NFT',
    attributes: {
      assets: []
    },
  },
};

const createMetadataAsync = async (attributes = []) => {
  const postBody = produce(initialBody, (draft) => {
    draft.pinataContent.attributes = attributes;
  });
  /*
  Example response:
  {
    "IpfsHash": "QmQ6xZB4uZ9GSsU53KP8NU5XmrCo4PNHohMrbrMZ1thTxu",
    "PinSize": 267,
    "Timestamp": "2021-04-18T14:20:54.393Z"}
  */
  const response = await axios.post(url, postBody, config);
  return response.data.IpfsHash;
};

export default createMetadataAsync;
