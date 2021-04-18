import React from 'react';
import logo from './logo.svg';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import styled from 'styled-components';
import AddCard from './AddCard';
import BasketCard from './BasketCard';
import BurstsCard from './BurstsCard';
import Header from './Header';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

const LogoImg = styled.img`
  max-height: 64px;
`;

const Content = styled.div``;

function App() {
  const [basket, setBasket] = React.useState({});

  return (
    <QueryClientProvider client={queryClient}>
      <Content>
        <Header />
        <Grid container spacing={3}>
          <Grid container item xs={12} justify='center'>
            <AddCard setBasket={setBasket} />
          </Grid>
          <Grid container item xs={6} justify='flex-end'>
            <BasketCard basket={basket} setBasket={setBasket} />
          </Grid>
          <Grid container item xs={6}>
            <BurstsCard />
          </Grid>
        </Grid>
      </Content>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}

export default App;
