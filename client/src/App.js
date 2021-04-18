import React from 'react';
import Grid from '@material-ui/core/Grid';

import styled from 'styled-components';
import Wallet from './components/Wallet';
import Header from './Header';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import CreateBurst from './components/CreateBurst';

const queryClient = new QueryClient();

const LogoImg = styled.img`
  max-height: 64px;
`;

const Content = styled.div``;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Wallet>
        <Content>
          <Header />
          <Grid container spacing={3}>
            <Grid container item xs={12} justify='center'>
              <CreateBurst />
            </Grid>
          </Grid>
        </Content>
      </Wallet>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
