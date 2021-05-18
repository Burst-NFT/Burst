import React from 'react';
import BurstContext from './BurstContext';

function useBurst() {
  const { bursts, balance } = React.useContext(BurstContext);
  return {
    bursts,
    balance
  };
}

export default useBurst;
