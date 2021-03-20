import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import logo from './logo.svg';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import MuiCard from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import styled from 'styled-components';
import MetaMaskButton from './MetaMaskButton';

const LogoImg = styled.img`
  max-height: 64px;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  margin-bottom: 64px;
`;

const AddCard = styled(MuiCard)`
  max-width: 500px;
`;

const Form = styled.form``;

const AmountArea = styled.div``;

const cryptoOptions = {
  '0xdac17f958d2ee523a2206206994597c13d831ec7': { symbol: 'USDT', name: 'Tether USD', address: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': { symbol: 'BTC', name: 'Bitcoin', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': { symbol: 'ETH', name: 'Ether', address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
};

const API_KEY = 'ckey_feace96ca3c74881a6a8f3cdea2';

const queryClient = new QueryClient();

function App() {
  const [selectedValue, setSelectedValue] = React.useState(0);
  const [selectedPrice, setSelectedPrice] = React.useState(0);
  const [amount, setAmount] = React.useState(0);

  const [basket, setBasket] = React.useState({});

  const handleChangeAsync = async (e) => {
    const address = e.target.value;
    setSelectedValue(address);

    const price = await fetch(`https://api.covalenthq.com/v1/pricing/historical_by_address/1/USD/${address}/?key=${API_KEY}`)
      .then((res) => res.json())
      .then(({ data }) => data.prices[0].price);

    setSelectedPrice(price);
  };

  const handleAmountChangeAsync = async (e) => {
    setAmount(e.target.value);
  };

  const handleAddClick = () => {
    setBasket((prev) => ({ ...prev, [selectedValue]: { price: selectedPrice, amount } }));
  };
  const handleDeleteClickFn = (basketKey) => () => {
    setBasket((prev) => {
      const { [basketKey]: removed, ...remaining } = prev;
      return remaining;
    });
  };
  return (
    <QueryClientProvider client={queryClient}>
      <Container className='App'>
        <Header>
          <MetaMaskButton />
        </Header>
        <Grid container spacing={3}>
          <Grid container item xs={12} justify='center'>
            <AddCard>
              <CardContent>
                <Form>
                  <FormControl variant='outlined'>
                    <InputLabel htmlFor='outlined-name-native-simple'>Name</InputLabel>
                    <NativeSelect
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
                      {Object.values(cryptoOptions).map((o) => (
                        <option key={o.symbol} value={o.address}>
                          {o.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                  <TextField
                    id='standard-number'
                    label='Amount'
                    type='number'
                    onChange={handleAmountChangeAsync}
                    value={amount}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Form>
                <AmountArea>
                  ${selectedPrice} x {amount} = ${selectedPrice * amount}
                </AmountArea>
              </CardContent>
              <CardActions>
                <Button size='small' color='primary' onClick={handleAddClick}>
                  Add
                </Button>
              </CardActions>
            </AddCard>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <List dense={true}>
                {Object.keys(basket).map((k) => (
                  <ListItem key={k}>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={cryptoOptions[k].name}
                      secondary={`$${basket[k].price} x ${basket[k].amount} = $${basket[k].price * basket[k].amount}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge='end' aria-label='delete' onClick={handleDeleteClickFn(k)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  );
}

export default App;
