import Grid from '@material-ui/core/Grid';
import { Color } from '@material-ui/lab/Alert';
import React from 'react';
import { AlertState } from '.';
import { useBursts } from '../../queries';
import Alert from '../Alert';
import { SLayout, SHeading } from '../styles';
import { MyBurstCard } from './MyBurstCard';
import { SPanel, SPanelsContainer } from './styles';

function PageComponent() {
  const { data: bursts } = useBursts();
  const [alert, setAlert] = React.useState<AlertState>({ msg: '', type: '' });
  return (
    <SLayout maxWidth='1600px'>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <SHeading>MANAGE YOUR BURSTS</SHeading>
        </Grid>
        <Grid item xs={12}>
          <SPanelsContainer>
            {!!bursts?.allIds?.length &&
              bursts.allIds.map((burstId) => <MyBurstCard burst={bursts.byId[burstId]} key={burstId} setAlert={setAlert} />)}
          </SPanelsContainer>
        </Grid>
      </Grid>
      <Alert text={alert.msg} open={!!alert.msg} severity={alert.type as Color} destroyAlert={() => setAlert({ msg: '', type: '' })} />
    </SLayout>
  );
}

export const Page = PageComponent;
