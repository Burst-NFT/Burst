import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '../CardHeader';
import Toolbar from '@material-ui/core/Toolbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { useAccountTokens } from '../queries';
import { useWallet } from '../Wallet';
import { getBurstAddress } from '../Burst/utils';
import BurstNftPanel from './BurstNftPanel';
import GenericNftPanel from './GenericNftPanel';
import Alert from '../Alert';
import { Typography } from '@material-ui/core';
import { Color } from '@material-ui/lab/Alert';
import { useBursts } from '../Burst';

export interface AlertState {
  msg: string;
  type?: string;
}

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
  // const { isLoading, error, data: tokens } = useAccountTokens();
  const { byId: burstById, allIds: burstAllIds } = useBursts();
  const [showOnlyBursts, setShowOnlyBursts] = React.useState(true);
  const burstAddress = React.useMemo(() => getBurstAddress({ chainId }) || '', [chainId]);
  const [alert, setAlert] = React.useState<AlertState>({ msg: '', type: '' });

  // console.log(tokens);
  const handleChangeShowBursts = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyBursts(e.target.checked);
  };

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
      {!!burstAllIds?.length &&
        burstAllIds.map((burstId) => {
          <BurstNftPanel burst={burstById[burstId]} key={burstId} setAlert={setAlert} />;
        })}
      {/* {isLoading ? (
        <Card>
          <CardContent>Loading...</CardContent>
        </Card>
      ) : (
        !!tokens && (
          <>
            {tokens.byId.get(burstAddress)?.nft_data?.map((data) => (
              <BurstNftPanel data={data} key={data.token_id} setAlert={setAlert} />
            ))}
            {!showOnlyBursts &&
              tokens.nftIds.filter((id) => id !== burstAddress).map((id) => <GenericNftPanel data={tokens.byId.get(id)} key={id} />)}
          </>
        )
      )} */}
      <Alert text={alert.msg} open={!!alert.msg} severity={alert.type as Color} destroyAlert={() => setAlert({ msg: '', type: '' })} />
    </Wrapper>
  );
}

export default ManageBurstsCard;
