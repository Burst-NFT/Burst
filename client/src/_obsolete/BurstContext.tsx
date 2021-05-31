import React from 'react';
import { Burst } from './burst';

export interface BurstById {
  [burstId: string]: Burst;
}
export interface BurstContextState {
  byId: BurstById;
  allIds: string[];
  // Total number of unique bursts
  balance: number;
}

export const BurstContext = React.createContext<BurstContextState>({
  byId: {} as BurstById,
  allIds: [],
  balance: 0,
});
BurstContext.displayName = 'Burst';
