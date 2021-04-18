import React from 'react';
import useWallet from './Wallet/useWallet';
import useTokenBalances from './TokenBalance/useTokenBalances';
import { getBurstAddress } from './Burst/utils';

function DisplayBalance() {
  const { network } = useWallet();
  const result = useTokenBalances();
  const data = result?.data || { byId: {} };
  const burstAddress = React.useMemo(() => getBurstAddress(network), [network]);
  return (
    <div>
      BURST:
      {result.status !== 'success' ? result.status : data.byId[burstAddress]?.balance || 0}
    </div>
  );
}

export default DisplayBalance;
