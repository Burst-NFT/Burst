import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MoralisProvider } from 'react-moralis';
import Header from './Header';
import Footer from './Footer';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CreateBurstCard } from './components/CreateBurst';
import ManageBursts from './components/ManageBursts';
import { WalletProvider } from './components/Wallet';
import { BurstProvider } from './components/Burst';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const LogoImg = styled.img`
  max-height: 64px;
`;

const Content = styled.div`
  min-height: 100vh;
`;

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          // background: 'rgb(2,0,36)',
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(124,67,189,1) 35%, rgba(0,212,255,1) 100%)',
          // minHeight: '100vh',
          // minHeight: '-webkit-fill-available',
        },
        html: {
          // height: '-webkit-fill-available',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#4a148c',
    },
    // type: 'dark',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* @ts-ignore we can trust that appId and serverUrl won't be undefined */}
      <MoralisProvider appId={process.env.REACT_APP_MORALIS_APP_ID} serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}>
        <WalletProvider>
          <BurstProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Router>
                <Header />
                <Content>
                  <Grid container>
                    <Switch>
                      {/* @ts-ignore weird error with exact */}
                      <Route exact path='/manage'>
                        <Grid container item xs={12} justify='center'>
                          <ManageBursts />
                        </Grid>
                      </Route>
                      {/* @ts-ignore weird error with exact */}
                      <Route exact path='/'>
                        <Grid container item xs={12} justify='center'>
                          <CreateBurstCard />
                        </Grid>
                      </Route>
                    </Switch>
                  </Grid>
                </Content>
                <Footer />
              </Router>
            </ThemeProvider>
          </BurstProvider>
        </WalletProvider>
      </MoralisProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}

export default App;
