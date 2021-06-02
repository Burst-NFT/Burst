import React from 'react';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useWallet } from './Wallet';
import { getBurstAddress } from './Burst/utils';
import MuiButton from '@material-ui/core/Button';
import { useAccountTokens } from '../queries';

// function

const BalanceButton = styled(MuiButton)`
  color: white;
  border-color: white;
  &:hover {
    border-color: white;
  }
`;
const NamePart = styled.div``;
const BalancePart = styled.div``;

const Wrapper = styled.div`
  display: flex;
`;

function DisplayBalance() {
  const { chainId } = useWallet();
  const { isLoading, data: accountTokens } = useAccountTokens();
  const balance = React.useMemo(() => {
    const burstAddress = getBurstAddress({ chainId });
    return (!isLoading && burstAddress && accountTokens?.byId.get(burstAddress)?.balance) || 0;
  }, [chainId, isLoading, accountTokens]);
  return (
    <Wrapper>
      <BalanceButton size='small' variant='outlined' color='secondary'>
        BURST: {isLoading ? '...' : balance}
      </BalanceButton>
    </Wrapper>
  );
}

export default DisplayBalance;
