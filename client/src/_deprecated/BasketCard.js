import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import Web3 from 'web3';
import BurstNFTContract from './contracts/BurstNFT.json';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
require("dotenv").config({path: "client/.env"});
const axios = require('axios');

const pinJSONToIPFS = (pinataApiKey, pinataSecretApiKey, _JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, _JSONBody, {
            "headers": {
                "pinata_api_key": pinataApiKey,
                "pinata_secret_api_key": pinataSecretApiKey
            }
        })
        .then(function (response) {
          console.log(response.data.IpfsHash);
            return response.data.IpfsHash;
        })
        .catch(function (error) {
          console.log(pinataApiKey);
          console.log(pinataSecretApiKey);
          console.log(process.env.PINATAAPIKEY);
          console.log(process.env.PINATASECRETAPIKEY);  
          return error;
        });
};

const JSONBody = {
  "pinataMetadata": {
      "name": "Burst NFT JSON"
  },
  "pinataContent": {
      "description": "An NFT that represents ERC20 assets", 
      "image": "https://gateway.pinata.cloud/ipfs/QmTgep8UJZxkumYWmfNoUYaqej1Fh2pDezxsgfZBa3RqVm", 
      "name": "Burst NFT",
      "attributes": []
  }
};

const StyledBasketCard = styled(MuiCard)`
  min-width: 500px;
  max-width: 700px;
`;

const CardActions = styled(MuiCardActions)`
  justify-content: center;
  margin-bottom: 16px;
  button {
    border-radius: 30px;
  }
`;

function BasketCard({ basket, setBasket }) {
  const web3Ref = React.useRef(null);
  const canCreateBasket = React.useMemo(() => !!(basket && Object.keys(basket).length), [basket]);
  const handleDeleteClickFn = (basketKey) => () => {
    setBasket((prev) => {
      const { [basketKey]: removed, ...remaining } = prev;
      return remaining;
    });
  };
  const handleCreateBurst = async () => {
    const networkId = await web3Ref.current.eth.net.getId();
    const deployedNetwork = BurstNFTContract.networks[networkId];
    const contract = new web3Ref.current.eth.Contract(BurstNFTContract.abi, deployedNetwork && deployedNetwork.address);

    const addresses = Object.keys(basket);

    for (let i = 0; i < addresses.length; i++) {
      const asset = basket[addresses[i]];
      debugger;
      await asset.contract.methods.approve(deployedNetwork.address, asset.amount).send({ from: window.ethereum?.selectedAddress });
    }

    const amounts = addresses.map((k) => basket[k].amount);

    const NFTJSON = JSONBody;
    const assetArray = [];
    addresses.forEach((address, i) => assetArray[i] = {"token_address": address, "token_amount": amounts[i]});
    NFTJSON.pinataContent.assets = assetArray;
    const IPFSResponse = await pinJSONToIPFS("f556fc9bed55416eb9e8", "571cf44a353d9634e85e01c603d7fb03188e1bff14b04c5b3b3f579edb4ce900", NFTJSON);

    const response = await contract.methods.createBurstWithMultiErc20(addresses, amounts, IPFSResponse).send({ from: window.ethereum?.selectedAddress });
    debugger;
  };

  React.useEffect(() => {
    (async () => {
      const _web3 = new Web3(window.ethereum);
      web3Ref.current = _web3;
    })();
  }, []);
  return (
    <StyledBasketCard>
      <CardHeader title='Basket' />
      <CardContent>
        <List dense={true}>
          {Object.keys(basket).map((k) => (
            <ListItem key={k}>
              <ListItemAvatar>
                <Avatar>
                  <MonetizationOnIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={basket[k].symbol ? `${basket[k].symbol}(${basket[k].address})` : basket[k].address}
                secondary={`Amount: ${basket[k].amount}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge='end' aria-label='delete' onClick={handleDeleteClickFn(k)}>
                  <DeleteOutlinedIcon style={{ color: red[500] }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button color='primary' size='large' variant='contained' onClick={handleCreateBurst} disabled={!canCreateBasket}>
          Create BURST
        </Button>
      </CardActions>
    </StyledBasketCard>
  );
}

export default BasketCard;
