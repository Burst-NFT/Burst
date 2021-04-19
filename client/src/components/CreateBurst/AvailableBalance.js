import React from 'react';
import styled from 'styled-components';
import Chip from '@material-ui/core/Chip';
import { formatUnits } from '@ethersproject/units';

import { useAccountTokens } from '../queries';

const StyledAvailableBalance = styled.div`
  padding-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  && {
    padding-right: 0;
  }
`;

function AvailableBalance({ tokenAddress }) {
  const { data: tokens } = useAccountTokens();

  const token = tokens.byId[tokenAddress];
  const balance = React.useMemo(() => {
    const _balance = token?.balance;
    return _balance ? parseFloat(formatUnits(_balance, token.contract_decimals)).toPrecision(4) : 0;
  }, [token]);
  return (
    <StyledAvailableBalance>
      <Chip color='primary' label={`Available balance: ${balance}`} />
    </StyledAvailableBalance>
  );
}

export default React.memo(AvailableBalance);
