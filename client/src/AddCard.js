import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import Web3 from 'web3';
import * as assets from './cryptoOptions';
import { CardHeader, Typography } from '@material-ui/core';
import erc20Interface from './erc20Interface.json';
import { COVALENT_API_KEY, MIN_ADDRESS_LENGTH, COVALENT_CHAIN_ID } from './constants';

const StyledAddCard = styled(MuiCard)`
  max-width: 500px;
`;

const CardActions = styled(MuiCardActions)`
  justify-content: center;
  margin-bottom: 16px;
  button {
    border-radius: 30px;
  }
`;

const Form = styled.form``;

const AmountArea = styled.div`
  /* display: flex; */
  padding: 32px 0 16px 0;
  /* text-align: center; */
`;

const AmountAvailableArea = styled.div`
  display: flex;
  font-style: italic;
`;
const Fields = styled.div`
  display: flex;
  flex-direction: row;
  > :not(:last-child) {
    padding-right: 16px;
  }
`;

function AddCard({ setBasket }) {
  // const [web3, setWeb3] = React.useState(null);
  const web3Ref = React.useRef(null);
  const [selectedAddress, setSelectedAddress] = React.useState('');
  const [selectedSymbol, setSelectedSymbol] = React.useState('');
  const [selectedPrice, setSelectedPrice] = React.useState('');

  const [amount, setAmount] = React.useState('');
  const [availableAmount, setAvailableAmount] = React.useState(0);
  const [contracts, setContracts] = React.useState({});
  const [isCustomAddress, setIsCustomAddress] = React.useState(false);
  const [customAddressInputErrMsg, setCustomAddressInputErrMsg] = React.useState('');
  const [customAddressInputValue, setCustomAddressInputValue] = React.useState('');

  const clear = () => {
    setAvailableAmount(0);
    setAmount(0);
    setSelectedAddress('');
    setSelectedPrice(0);
    setCustomAddressInputErrMsg('');
    setCustomAddressInputValue('');
  };

  React.useEffect(() => {
    (async () => {
      // if (window.ethereum) {
      const _web3 = new Web3(window.ethereum);
      web3Ref.current = _web3;

      // build the initial erc20 contracts
      const contracts = assets.allIds.reduce((acc, assetAddress) => {
        acc[assetAddress] = new web3Ref.current.eth.Contract(erc20Interface, assetAddress);
        return acc;
      }, {});

      setContracts(contracts);
    })();
  }, []);

  const handleSelectChangeAsync = async (e) => {
    const address = e.target.value;
    setSelectedAddress(address);
    // Maybe change this to spot price?
    let price = 0;
    if (address) {
      price = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_address/${COVALENT_CHAIN_ID}/USD/${address}/?key=${COVALENT_API_KEY}`)
        .then((res) => res.json())
        .then(({ data }) => data.prices[0].price);
      setSelectedSymbol(assets.byId[address].symbol);
    }

    setSelectedPrice(price);
  };

  const handleAmountChangeAsync = async (e) => {
    setAmount(e.target.value);
  };

  const handleAddClick = () => {
    setBasket((prev) => ({
      ...prev,
      [selectedAddress]: { symbol: selectedSymbol, amount, address: selectedAddress, contract: contracts[selectedAddress] },
    }));
    clear();
  };
  const displayAccountAddress = !!window.ethereum?.selectedAddress && `${window.ethereum?.selectedAddress.slice(0, -30)}...`;

  const handleMaxClick = () => {
    setAmount(availableAmount);
  };

  const handleSetCustomAddressClick = () => {
    try {
      setAvailableAmount(0); // clear the available amount
      // attempt to create a contract, will error if invalid
      const contract = new web3Ref.current.eth.Contract(erc20Interface, customAddressInputValue);
      // selected address is the valid address that can be added to the basket
      setSelectedAddress(customAddressInputValue);
      setContracts((prev) => {
        prev[customAddressInputValue] = contract;
        return prev;
      });
    } catch (error) {
      console.error(error);
      setCustomAddressInputErrMsg('Invalid address');
    }
  };

  // Whenever the selected address changes, this should run and grab the available amount
  React.useEffect(() => {
    (async () => {
      if (selectedAddress.length >= MIN_ADDRESS_LENGTH && contracts[selectedAddress]) {
        // debugger;
        const balance = await contracts[selectedAddress].methods.balanceOf(window.ethereum?.selectedAddress).call();
        const symbol = await contracts[selectedAddress].methods.symbol().call();
        setSelectedSymbol(symbol);
        setAvailableAmount(Number(balance));
        console.log('React.useEffect', window.ethereum?.selectedAddress, selectedAddress, balance);
      }
    })();
  }, [selectedAddress]);

  return (
    <StyledAddCard>
      <CardHeader title='Account' subheader={displayAccountAddress} />
      <Form>
        <CardContent>
          <Fields>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCustomAddress}
                  onChange={() => {
                    setIsCustomAddress((prev) => !prev);
                    clear();
                  }}
                  name='customAddressChecked'
                  color='primary'
                />
              }
              label='Use custom address'
            />
          </Fields>
          <Fields style={{ marginBottom: '16px' }}>
            {isCustomAddress ? (
              <>
                <TextField
                  style={{ width: '100%' }}
                  variant='outlined'
                  id='custom-address'
                  label='Address'
                  type='text'
                  onChange={(e) => {
                    setCustomAddressInputValue(e.target.value);
                    setCustomAddressInputErrMsg('');
                  }}
                  value={customAddressInputValue}
                  error={!!customAddressInputErrMsg}
                  helperText={customAddressInputErrMsg}
                />
                <Button
                  variant='contained'
                  onClick={handleSetCustomAddressClick}
                  disabled={customAddressInputValue.length < MIN_ADDRESS_LENGTH}
                  disableElevation
                >
                  Set
                </Button>
              </>
            ) : (
              <FormControl variant='outlined' style={{ width: '100%' }}>
                <InputLabel htmlFor='outlined-name-native-simple'>Name</InputLabel>
                <Select
                  native
                  value={selectedAddress}
                  onChange={handleSelectChangeAsync}
                  label='Name'
                  inputProps={{
                    name: 'name',
                    id: 'outlined-name-native-simple',
                  }}
                >
                  <option aria-label='None' value='' />
                  {assets.allIds.map((o) => (
                    <option key={assets.byId[o].symbol} value={assets.byId[o].address}>
                      {assets.byId[o].symbol}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          </Fields>
          <Fields>
            <TextField
              style={{ width: '100%' }}
              variant='outlined'
              id='standard-number'
              label='Amount'
              type='number'
              onChange={handleAmountChangeAsync}
              value={amount}
              disabled={!availableAmount}
            />
            <Button variant='outlined' onClick={handleMaxClick} disabled={!availableAmount} style={{ maxHeight: '56px' }}>
              Max
            </Button>
          </Fields>
          {!!availableAmount && <AmountAvailableArea>Amount Available: {availableAmount}</AmountAvailableArea>}

          {!!selectedAddress && (
            <AmountArea>
              <Typography paragraph>
                <strong>Details:</strong>
              </Typography>
              <Typography variant='caption' display='block'>
                Address: {selectedAddress}
              </Typography>
              <Typography variant='caption' display='block'>
                Symbol: {selectedSymbol}
              </Typography>
              <Typography variant='caption' display='block'>
                Amount To Add: {amount || 0}
              </Typography>
            </AmountArea>
          )}
        </CardContent>
        <CardActions>
          <Button color='primary' size='large' variant='contained' onClick={handleAddClick} disabled={!(amount && selectedAddress)}>
            Add
          </Button>
        </CardActions>
      </Form>
    </StyledAddCard>
  );
}

export default AddCard;
