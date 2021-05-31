import React from 'react';
import { BurstContext, BurstContextState } from './BurstContext';

export interface UseBurstsResult extends BurstContextState {}

export function useBursts(): UseBurstsResult {
  const { byId, allIds, balance } = React.useContext(BurstContext);
  return {
    byId,
    allIds,
    balance,
  };
}
