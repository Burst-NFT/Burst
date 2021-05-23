import React from 'react';
import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useWallet } from './Wallet';
import { getBurstAddress } from './Burst/utils';
import MuiButton from '@material-ui/core/Button';
import { useAccountTokens } from './queries';

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
  const { isLoading, data: tokens } = useAccountTokens();
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const handleClick = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget as HTMLDivElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'burst-details-popover' : undefined;
  const balance = React.useMemo(() => {
    const burstAddress = getBurstAddress({ chainId });
    return (!isLoading && burstAddress && tokens?.byId[burstAddress]?.balance) || 0;
  }, [chainId, isLoading, tokens]);
  return (
    <Wrapper>
      <BalanceButton aria-describedby={id} size='small' variant='outlined' color='secondary' onClick={handleClick}>
        BURST: {isLoading ? '...' : balance}
      </BalanceButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography style={{ paddingLeft: '4px', paddingRight: '4px' }} color='textSecondary' variant='caption'>
          {isLoading ? 'Loading...' : `You have a balance of ${balance} BURST`}
        </Typography>
      </Popover>
    </Wrapper>
  );
}

export default DisplayBalance;
