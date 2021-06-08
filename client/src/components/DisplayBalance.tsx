import React from 'react';
import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { useWallet } from './Wallet';
import MuiButton from '@material-ui/core/Button';
import { createBurstContract } from '../utils';
// function

const BalanceButton = styled(MuiButton)`
  && {
    border: 2px solid black;
    color: black;
    background: white;
  }

  /* color: white;
  border-color: white;
  &:hover {
    border-color: white;
  } */
`;
const NamePart = styled.div``;
const BalancePart = styled.div``;

const Wrapper = styled.div`
  display: flex;
`;

function DisplayBalance() {
  const { web3, account, chainId } = useWallet();
  const [balanceAmount, setBalanceAmount] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      if (account && web3.utils.isAddress(account)) {
        // TODO: TURN THIS INTO A REACT QUERY SO WE CAN REFRESH ELSEWHERE IN THE APP
        const contract = createBurstContract({ web3, chainId });
        if (contract) {
          const _balance: string = await contract.methods.balanceOf(account).call();
          const balanceAmount = parseFloat(_balance);
          setBalanceAmount(balanceAmount);
          return;
        }
      }

      setBalanceAmount(0);
    })();
  }, [account, chainId]);
  return (
    <Wrapper>
      {/* @ts-ignore component={RouterLink} is fine for now */}
      <BalanceButton size='small' variant='outlined' color='secondary' component={RouterLink} to='/manage'>
        BURST: {balanceAmount === undefined ? '...' : balanceAmount}
      </BalanceButton>
    </Wrapper>
  );
}

export default DisplayBalance;
