import React from 'react';
import Grid from '@material-ui/core/Grid';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import blue from '@material-ui/core/colors/blue';
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

// const theme = createMuiTheme({
//   palette: {
//     primary: {
//       // light: will be calculated from palette.primary.main,
//       main: '#ff4400',
//       // dark: will be calculated from palette.primary.main,
//       // contrastText: will be calculated to contrast with palette.primary.main
//     },
//     secondary: {
//       light: '#0066ff',
//       main: '#0044ff',
//       // dark: will be calculated from palette.secondary.main,
//       contrastText: '#ffcc00',
//     },
//     // Used by `getContrastText()` to maximize the contrast between
//     // the background and the text.
//     contrastThreshold: 3,
//     // Used by the functions below to shift a color's luminance by approximately
//     // two indexes within its tonal palette.
//     // E.g., shift from Red 500 to Red 300 or Red 700.
//     tonalOffset: 0.2,
//   },
// });

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#303030',
        },
      },
    },
  },
  palette: {
    primary: blue,
    // type: 'dark',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Wallet>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Content>
            <Header />
            <Grid container spacing={3}>
              <Grid container item xs={12} justify='center'>
                <CreateBurst />
              </Grid>
            </Grid>
          </Content>
        </ThemeProvider>
      </Wallet>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
