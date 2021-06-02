import React from 'react';
import styled from 'styled-components';
import Chip from '@material-ui/core/Chip';
import { formatUnits } from '@ethersproject/units';

import { useAccountTokens } from '../../queries';

const StyledAvailableBalance = styled.div`
  padding-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  && {
    padding-right: 0;
  }
`;

export interface AvailableBalanceProps {
  tokenAddress: string;
}

export const AvailableBalance = React.memo(function AvailableBalance({ tokenAddress }: AvailableBalanceProps) {
  const { data: tokens } = useAccountTokens();

  const token = tokens?.byId.get(tokenAddress);
  const balance: string = React.useMemo(() => {
    const _balance = token?.balance;
    return _balance ? formatUnits(_balance, token?.decimals) : '0';
  }, [token]);
  return (
    <StyledAvailableBalance>
      <Chip color='primary' label={`Available balance: ${balance}`} />
    </StyledAvailableBalance>
  );
});
