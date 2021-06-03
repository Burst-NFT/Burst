import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '../CardHeader';
import Toolbar from '@material-ui/core/Toolbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { useWallet } from '../Wallet';
import { getBurstAddress } from '../Burst/utils';
import { BurstNftPanel } from './BurstNftPanel';
import { GenericNftPanel } from './GenericNftPanel';
import Alert from '../Alert';
import { Typography } from '@material-ui/core';
import { Color } from '@material-ui/lab/Alert';
import { useBursts } from '../../queries';
import { AlertState } from '.';

const Card = styled(MuiCard)`
  /* max-width: 650px; */
`;

const CardActions = styled(MuiCardActions)`
  justify-content: center;
  margin-bottom: 16px;
  button {
    border-radius: 30px;
  }
`;

const Wrapper = styled.div`
  min-width: 600px;
`;

function ManageBurstsCard() {
  const { chainId } = useWallet();
  const { data: bursts } = useBursts();
  const [alert, setAlert] = React.useState<AlertState>({ msg: '', type: '' });

  return (
    <Wrapper>
      <Card>
        <CardHeader title='Manage' />
        {/* <Toolbar>
          {
            <FormControlLabel
              control={<Switch checked={showOnlyBursts} onChange={handleChangeShowBursts} name='showBursts' color='primary' />}
              label={<Typography variant='body2'>Show only BURSTs</Typography>}
            />
          }
        </Toolbar> */}
      </Card>
      {!!bursts?.allIds?.length && bursts.allIds.map((burstId) => <BurstNftPanel burst={bursts.byId[burstId]} key={burstId} setAlert={setAlert} />)}
      <Alert text={alert.msg} open={!!alert.msg} severity={alert.type as Color} destroyAlert={() => setAlert({ msg: '', type: '' })} />
    </Wrapper>
  );
}

export { ManageBurstsCard };
