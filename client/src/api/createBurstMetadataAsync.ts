import axios from 'axios';
import produce from 'immer';
import { ApiBurstMetadataAsset } from '../components/Burst';

const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
const config = {
  headers: {
    pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
    pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
  },
};

interface PinataMetadata {
  name: string;
}

interface PinataContent {
  description: string;
  image: string;
  name: string;
  attributes: PinataAttribute[];
}

interface PinataAttribute extends ApiBurstMetadataAsset {}

interface PinataPostBody {
  pinataMetadata: PinataMetadata;
  pinataContent: PinataContent;
}

const initialBody = {
  description: 'An NFT that represents ERC20 assets',
  image: 'https://gateway.pinata.cloud/ipfs/QmTgep8UJZxkumYWmfNoUYaqej1Fh2pDezxsgfZBa3RqVm',
  name: 'Burst NFT',
  attributes: [],
};

const imageUrls = [
  'https://gateway.pinata.cloud/ipfs/Qmdm9KxTKuWxhckL9HMySVR6QNfLw6vdN3AvMn5ce97tzF',
  'https://gateway.pinata.cloud/ipfs/QmPNSe8ybanuWdDypht9Gdf1VKVW5biJv554JYXbf8tWcq',
  'https://gateway.pinata.cloud/ipfs/Qmc2PVfctGq9Njep7j4x8gCAipdeiCna9edxE89FZaqFKS',
  'https://gateway.pinata.cloud/ipfs/QmdLyEEZpQJxbRJ7oUuN2R5kegwG75R3mjBdrYwwYVyFvr',
  'https://gateway.pinata.cloud/ipfs/QmfTQTSSUUfhqzjpPvFMhzC2C7UtJUysWzMUu9RHYR2dCL',
  'https://gateway.pinata.cloud/ipfs/QmQETVb9pCHoYUsUhov9iB9PSNQaSVN2KbsYbDvKnTMMDx',
  'https://gateway.pinata.cloud/ipfs/QmWV1FMUf86pM1uhmWD38n4mSr6MtD4pgzDGuiSnBrb364',
  'https://gateway.pinata.cloud/ipfs/QmdbZ5Ghkt7c2dKGF6WyQJtCw8m8BJTsRTyd3oyMMnom3c',
  'https://gateway.pinata.cloud/ipfs/Qme44pstuhLcMTRHQqfgNcJdmz2wjC5tkhnNozhtFi2ENF',
  'https://gateway.pinata.cloud/ipfs/QmbVBuhWa3xpdJkBLkYh4cPQMfxHMiC8g8qaeL871XrSuY',
  'https://gateway.pinata.cloud/ipfs/QmTgep8UJZxkumYWmfNoUYaqej1Fh2pDezxsgfZBa3RqVm',
];

const getRandomImageUrl = () => imageUrls[Math.floor(Math.random() * imageUrls.length)];

export const createBurstMetadataAsync = async (Moralis: any, attributes: ApiBurstMetadataAsset[] = []) => {
  const postBody = produce(initialBody, (draft: any) => {
    draft.attributes = attributes;
    const image = getRandomImageUrl();
    draft.image = image;
  });
  const burstJson = new Moralis.File('BurstNFT.json', { base64: btoa(JSON.stringify(postBody)) });
  await burstJson.saveIPFS();
  const response = burstJson.hash();
  console.log(burstJson.ipfs(), burstJson.hash());
  return response;
};
