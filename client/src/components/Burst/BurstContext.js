import React from 'react';

const BurstContext = React.createContext({
  bursts: {},
  balance: 0
});
BurstContext.displayName = 'Burst';
export default BurstContext;
