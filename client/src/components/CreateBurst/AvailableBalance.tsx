import React from 'react';
import styled from 'styled-components';
import Chip from '@material-ui/core/Chip';
import { abi as ERC20ABI } from '../../contracts/ERC20.json';
import { useWallet } from '../Wallet';
import { formatUnits } from '@ethersproject/units';
import { getDecimalsOrDefaultAsync } from '../../utils/getDecimalsOrDefaultAsync';

const StyledAvailableBalance = styled.div`
  padding-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  && {
    padding-right: 0;
  }
`;

export interface AvailableBalanceProps {
  address: string;
}

function AvailableBalanceComponent({ address }: AvailableBalanceProps) {
  const { web3, account } = useWallet();
  const [balanceAmount, setBalanceAmount] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      if (address && web3.utils.isAddress(address)) {
        const contract = new web3.eth.Contract(ERC20ABI, address);
        const decimals = await getDecimalsOrDefaultAsync({ contract });
        const _balance: string = await contract.methods.balanceOf(account).call();
        const balanceAmount = parseFloat(formatUnits(_balance, decimals));
        setBalanceAmount(balanceAmount);
      } else {
        setBalanceAmount(0);
      }
    })();
  }, [address, account]);
  return (
    <StyledAvailableBalance>
      <Chip color='primary' label={`Available balance: ${balanceAmount}`} />
    </StyledAvailableBalance>
  );
}

export const AvailableBalance = React.memo(AvailableBalanceComponent);
