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

const chooseImage = () => {
  let randomNumber = Math.floor(Math.random() * 10) + 1;
  if (randomNumber === 1) {
    return 'https://gateway.pinata.cloud/ipfs/Qmdm9KxTKuWxhckL9HMySVR6QNfLw6vdN3AvMn5ce97tzF'
  } else if (randomNumber === 2) {
    return 'https://gateway.pinata.cloud/ipfs/QmPNSe8ybanuWdDypht9Gdf1VKVW5biJv554JYXbf8tWcq'
  } else if (randomNumber === 3) {
    return 'https://gateway.pinata.cloud/ipfs/Qmc2PVfctGq9Njep7j4x8gCAipdeiCna9edxE89FZaqFKS'
  } else if (randomNumber === 4) {
    return 'https://gateway.pinata.cloud/ipfs/QmdLyEEZpQJxbRJ7oUuN2R5kegwG75R3mjBdrYwwYVyFvr'
  } else if (randomNumber === 5) {
    return 'https://gateway.pinata.cloud/ipfs/QmfTQTSSUUfhqzjpPvFMhzC2C7UtJUysWzMUu9RHYR2dCL'
  } else if (randomNumber === 6) {
    return 'https://gateway.pinata.cloud/ipfs/QmQETVb9pCHoYUsUhov9iB9PSNQaSVN2KbsYbDvKnTMMDx'
  } else if (randomNumber === 7) {
    return 'https://gateway.pinata.cloud/ipfs/QmWV1FMUf86pM1uhmWD38n4mSr6MtD4pgzDGuiSnBrb364'
  } else if (randomNumber === 8) {
    return 'https://gateway.pinata.cloud/ipfs/QmdbZ5Ghkt7c2dKGF6WyQJtCw8m8BJTsRTyd3oyMMnom3c'
  } else if (randomNumber === 9) {
    return 'https://gateway.pinata.cloud/ipfs/Qme44pstuhLcMTRHQqfgNcJdmz2wjC5tkhnNozhtFi2ENF'
  } else if (randomNumber === 10) {
    return 'https://gateway.pinata.cloud/ipfs/QmbVBuhWa3xpdJkBLkYh4cPQMfxHMiC8g8qaeL871XrSuY'
  } else {
    return 'https://gateway.pinata.cloud/ipfs/QmTgep8UJZxkumYWmfNoUYaqej1Fh2pDezxsgfZBa3RqVm'
  }
}

const createMetadataAsync = async (attributes = []) => {
  const postBody = produce(initialBody, (draft) => {
    draft.pinataContent.attributes = attributes;
    const image = chooseImage();
    draft.pinataContent.image = image;
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
