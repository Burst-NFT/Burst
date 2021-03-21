import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MuiListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import { red, green } from '@material-ui/core/colors';
import Web3 from 'web3';
import BurstNFTContract from './contracts/BurstNFT.json';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import { COVALENT_API_KEY, MIN_ADDRESS_LENGTH, COVALENT_CHAIN_ID } from './constants';

const StyledBurstsCard = styled(MuiCard)`
  min-width: 500px;
  /* max-width: 700px; */
`;

const CardActions = styled(MuiCardActions)`
  justify-content: center;
  margin-bottom: 16px;
  button {
    border-radius: 30px;
  }
`;

const ListItemSecondaryAction = styled(MuiListItemSecondaryAction)`
  && {
    top: 20%;
  }
`;

function BurstsCard() {
  const web3Ref = React.useRef(null);
  const [bursts, setBursts] = React.useState({});
  const [activeTokenId, setActiveTokenId] = React.useState('');
  const [openSendDialog, setOpenSendDialog] = React.useState(false);
  const [sendDialogAddressValue, setSendDialogAddressValue] = React.useState('');

  const handleCloseSendDialogClick = () => {
    setOpenSendDialog(false);
    setActiveTokenId('');
    setSendDialogAddressValue('');
  };

  const handleSendSendDialogClick = async () => {
    const networkId = await web3Ref.current.eth.net.getId();
    const deployedNetwork = BurstNFTContract.networks[networkId];
    const contract = new web3Ref.current.eth.Contract(BurstNFTContract.abi, deployedNetwork && deployedNetwork.address);

    const response = await contract.methods
      .transferFrom(window.ethereum?.selectedAddress, sendDialogAddressValue, activeTokenId)
      .send({ from: window.ethereum?.selectedAddress });
    debugger;
    await handleCheckBurstsClick();
    handleCloseSendDialogClick();
  };

  const handleDestroyClickFn = (tokenId) => async () => {
    const networkId = await web3Ref.current.eth.net.getId();
    const deployedNetwork = BurstNFTContract.networks[networkId];
    const contract = new web3Ref.current.eth.Contract(BurstNFTContract.abi, deployedNetwork && deployedNetwork.address);

    const response = await contract.methods.destroyBurstWithMultiERC20(tokenId).send({ from: window.ethereum?.selectedAddress });
    debugger;
    await handleCheckBurstsClick();
  };
  const handleTransferClickFn = (tokenId) => async () => {
    setActiveTokenId(tokenId);
    setOpenSendDialog(true);
  };

  const fetchPriceAsync = (address) => {
    return fetch(`https://api.covalenthq.com/v1/pricing/historical_by_address/${COVALENT_CHAIN_ID}/USD/${address}/?key=${COVALENT_API_KEY}`)
      .then((res) => res.json())
      .then(({ data }) => data.prices[0].price)
      .catch(() => Promise.resolve(0));
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
      const nftInfo = await contract.methods.getBurstNftInfo(tokenId).call();
      console.log(nftInfo);
      const assets = await Promise.all(
        nftInfo[0].map(async (addr, idx) => ({
          address: addr,
          amount: nftInfo[1][idx],
          price: await fetchPriceAsync(addr),
        }))
      );
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
    <>
      <Dialog onClose={handleCloseSendDialogClick} aria-labelledby='simple-dialog-title' open={openSendDialog}>
        <DialogTitle id='simple-dialog-title'>Send BURST</DialogTitle>
        <DialogContent>
          <DialogContentText>Send your burst token to the following address:</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Address'
            type='text'
            value={sendDialogAddressValue}
            onChange={(e) => {
              setSendDialogAddressValue(e.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSendDialogClick} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleSendSendDialogClick}
            color='primary'
            disabled={!(sendDialogAddressValue?.length && sendDialogAddressValue.length >= MIN_ADDRESS_LENGTH)}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <StyledBurstsCard>
        <CardHeader title='Bursts' />
        <CardContent>
          <List dense={true}>
            {Object.keys(bursts).map((tokenId) => (
              <ListItem key={tokenId} alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar>
                    <MonetizationOnIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary='BURST'
                  secondary={
                    <>
                      <div>Token Id: {bursts[tokenId].tokenId} </div>
                      {bursts[tokenId].assets.map((asset) => (
                        <>
                          <Divider />
                          <div>Address: {asset.address}</div>
                          <div>Amount: {asset.amount}</div>
                          <div>Price (USD): {asset.price ? `$${asset.price}` : 'Unavailable'}</div>
                        </>
                      ))}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label='send' onClick={handleTransferClickFn(tokenId)}>
                    <SendIcon style={{ color: green[500] }} />
                  </IconButton>
                  <IconButton aria-label='delete' onClick={handleDestroyClickFn(tokenId)}>
                    <DeleteOutlinedIcon style={{ color: red[500] }} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <CardActions>
          <Button color='primary' size='large' variant='contained' onClick={handleCheckBurstsClick}>
            Check for BURSTs
          </Button>
        </CardActions>
      </StyledBurstsCard>
    </>
  );
}

export default BurstsCard;
