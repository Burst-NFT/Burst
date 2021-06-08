import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useMoralisQuery } from 'react-moralis';
import { tables } from '../../data/moralis';

function PageComponent() {
  const { data, error, isLoading } = useMoralisQuery(tables.marketplaceOrderCreatedEvents);
  return (
    <Grid container item xs={12} justify='center'>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Grid>
  );
}

export const Page = PageComponent;
