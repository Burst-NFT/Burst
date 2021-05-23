import React from 'react';

export interface BurstAsset {
  address: string;
  balance: number;
}

export interface Burst {
  tokenId: string;
  assets: BurstAsset[];
}

export interface BurstsState {
  [tokenId: string]: Burst;
}

export interface BurstContextState {
  bursts: BurstsState;
  // Total number of unique bursts
  balance: number;
}

export const BurstContext = React.createContext<BurstContextState>({
  bursts: {},
  balance: 0,
});
BurstContext.displayName = 'Burst';
