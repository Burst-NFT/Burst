import React from 'react';
import styled from 'styled-components';
import Chip from '@material-ui/core/Chip';
import { formatUnits } from '@ethersproject/units';

import { useAccountTokens } from '../queries';
import { convertToFloat } from '../../utils/convertToFloat';

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

function AvailableBalance({ tokenAddress }: AvailableBalanceProps) {
  const { data: tokens } = useAccountTokens();


  const token = tokens?.byId[tokenAddress];
  const balance = React.useMemo(() => {
    const _balance = token?.balance;
    return convertToFloat({value: _balance, decimals: token?.contract_decimals});
  }, [token]);
  return (
    <StyledAvailableBalance>
      <Chip color='primary' label={`Available balance: ${balance}`} />
    </StyledAvailableBalance>
  );
}

export default React.memo(AvailableBalance);
