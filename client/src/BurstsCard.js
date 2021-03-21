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

const StyledBurstsCard = styled(MuiCard)`
  min-width: 500px;
  max-width: 700px;
`;

const CardActions = styled(MuiCardActions)`
  justify-content: center;
`;

function BurstsCard() {
  const web3Ref = React.useRef(null);
  const [bursts, setBursts] = React.useState({});

  const handleDestroyClickFn = (tokenId) => async () => {
    const networkId = await web3Ref.current.eth.net.getId();
    const deployedNetwork = BurstNFTContract.networks[networkId];
    const contract = new web3Ref.current.eth.Contract(BurstNFTContract.abi, deployedNetwork && deployedNetwork.address);

    const response = await contract.methods.destroyBurstWithMultiERC20(tokenId);
    debugger;
    await handleCheckBurstsClick();
  };
  const handleCheckBurstsClick = async () => {
    const networkId = await web3Ref.current.eth.net.getId();
    const deployedNetwork = BurstNFTContract.networks[networkId];
    const contract = new web3Ref.current.eth.Contract(BurstNFTContract.abi, deployedNetwork && deployedNetwork.address);

    const ownerAddress = window.ethereum?.selectedAddress;
    const balance = await contract.methods.balanceOf(ownerAddress).call();

    const _bursts = {};
    for (let i = 0; i < Number.parseInt(balance); i++) {
      const tokenId = await contract.methods.tokenOfOwnerByIndex(ownerAddress, i).call();
      const nftInfo = await contract.methods.nftIndexToNftInfoMapping[tokenId].call();
      const assets = nftInfo.assetAddresses.map((val, idx) => ({ address: val, amount: nftInfo.assetAmounts[idx] }));
      _bursts[tokenId] = { tokenId, assets };
    }

    setBursts(_bursts);
    // debugger;
  };

  React.useEffect(() => {
    (async () => {
      const _web3 = new Web3(window.ethereum);
      web3Ref.current = _web3;
    })();
  }, []);
  return (
    <StyledBurstsCard>
      <CardHeader title='Bursts' />
      <CardContent>
        <List dense={true}>
          {Object.keys(bursts).map((tokenId) => (
            <ListItem key={tokenId}>
              <ListItemAvatar>
                <Avatar>
                  <MonetizationOnIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='1 BURST'
                secondary={
                  <>
                    <div>Token Id: {bursts[tokenId].tokenId} </div>
                    {bursts[tokenId].assets.map((asset) => (
                      <div>
                        {asset.address}:{asset.amount}
                      </div>
                    ))}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge='end' aria-label='delete' onClick={handleDestroyClickFn(tokenId)}>
                  <DeleteOutlinedIcon style={{ color: red[500] }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button color='primary' size='large' variant='outlined' onClick={handleCheckBurstsClick}>
          Check for BURSTs
        </Button>
      </CardActions>
    </StyledBurstsCard>
  );
}

export default BurstsCard;
