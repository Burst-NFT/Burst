import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Wallet from './components/Wallet';
import Header from './Header';
import Footer from './Footer';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import CreateBurst from './components/CreateBurst';
import ManageBursts from './components/ManageBursts';

const queryClient = new QueryClient();

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
          background: 'rgb(2,0,36)',
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
      <Wallet>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Header />
            <Content>
              <Grid container>
                <Switch>
                  <Route exact path='/manage'>
                    <Grid container item xs={12} justify='center'>
                      <ManageBursts />
                    </Grid>
                  </Route>
                  <Route exact path='/'>
                    <Grid container item xs={12} justify='center'>
                      <CreateBurst />
                    </Grid>
                  </Route>
                </Switch>
              </Grid>
            </Content>
            <Footer />
          </Router>
        </ThemeProvider>
      </Wallet>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}

export default App;
