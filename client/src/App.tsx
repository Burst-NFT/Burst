import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MoralisProvider } from 'react-moralis';
import Header from './Header';
import Footer from './Footer';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Page as CreateBurstPage } from './components/CreateBurst';
import { Page as ManageBurstsPage } from './components/ManageBursts';
import { Page as MarketplacePage } from './components/Marketplace';
import { WalletProvider } from './components/Wallet';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const SContent = styled.div`
  margin-top: 32px;
  min-height: 100vh;
`;

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          // background: 'rgb(2,0,36)',
          // background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(124,67,189,1) 35%, rgba(0,212,255,1) 100%)',
          // minHeight: '100vh',
          // minHeight: '-webkit-fill-available',
        },
        html: {
          // height: '-webkit-fill-available',
        },
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderWidth: '2px',
      },
    },
    MuiButton: {
      outlined: {
        border: '2px solid #212121',
        '&$disabled': {
          borderWidth: '2px',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#F7D9E7',
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
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <SContainer>
                <Header />
                <SContent>
                  <Switch>
                    <Route exact path='/marketplace'>
                      <MarketplacePage />
                    </Route>
                    <Route exact path='/manage'>
                      <ManageBurstsPage />
                    </Route>
                    <Route exact path='/'>
                      <CreateBurstPage />
                    </Route>
                  </Switch>
                </SContent>
                <Footer />
              </SContainer>
            </Router>
          </ThemeProvider>
        </WalletProvider>
      </MoralisProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}

export default App;
