import React from 'react';
import { BurstContext } from './BurstContext';

export function useBurst() {
  const { bursts, balance } = React.useContext(BurstContext);
  return {
    bursts,
    balance,
  };
}
