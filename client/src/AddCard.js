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
import Select from '@material-ui/core/Select';
import * as cryptoOptions from './cryptoOptions';
import { Typography } from '@material-ui/core';

const StyledAddCard = styled(MuiCard)`
  max-width: 500px;
`;

const CardActions = styled(MuiCardActions)`
  justify-content: flex-end;
`;

const Form = styled.form``;

const AmountArea = styled.div`
  display: flex;
  padding: 32px 0 16px 0;
  /* text-align: center; */
`;
const Fields = styled.div`
  > :not(:last-child) {
    padding-right: 16px;
  }
`;

const COVALENT_API_KEY = 'ckey_feace96ca3c74881a6a8f3cdea2';

function AddCard({ setBasket }) {
  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedPrice, setSelectedPrice] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const handleChangeAsync = async (e) => {
    const address = e.target.value;
    setSelectedValue(address);
    // Maybe change this to spot price?
    const price = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_address/1/USD/${address}/?key=${COVALENT_API_KEY}`)
      .then((res) => res.json())
      .then(({ data }) => data.prices[0].price);

    setSelectedPrice(price);
  };

  const handleAmountChangeAsync = async (e) => {
    setAmount(e.target.value);
  };

  const handleAddClick = () => {
    setBasket((prev) => ({ ...prev, [selectedValue]: { price: selectedPrice, amount } }));
    setSelectedValue('');
    setAmount('');
    setSelectedPrice(0);
  };

  return (
    <StyledAddCard>
      <Form>
        <CardContent>
          <Fields>
            <FormControl variant='outlined'>
              <InputLabel htmlFor='outlined-name-native-simple'>Name</InputLabel>
              <Select
                native
                value={selectedValue}
                onChange={handleChangeAsync}
                label='Name'
                inputProps={{
                  name: 'name',
                  id: 'outlined-name-native-simple',
                }}
              >
                <option aria-label='None' value='' />
                {cryptoOptions.allIds.map((o) => (
                  <option key={cryptoOptions.byId[o].symbol} value={cryptoOptions.byId[o].address}>
                    {cryptoOptions.byId[o].name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <TextField variant='outlined' id='standard-number' label='Amount' type='number' onChange={handleAmountChangeAsync} value={amount} />
          </Fields>

          <AmountArea>
            <Typography>
              <strong>Total:</strong>
            </Typography>
            {!!(selectedPrice || amount) && (
              <Typography>
                ${selectedPrice || 0} x {amount || 0} = ${selectedPrice * amount}
              </Typography>
            )}
          </AmountArea>
        </CardContent>
        <CardActions>
          <Button color='primary' variant='outlined' onClick={handleAddClick} disabled={!(amount && selectedValue)}>
            Add
          </Button>
        </CardActions>
      </Form>
    </StyledAddCard>
  );
}

export default AddCard;
