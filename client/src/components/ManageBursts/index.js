import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { useAccountTokens } from '../queries';
import useWallet from '../Wallet/useWallet';
import ErrorAlert from '../ErrorAlert';
import { getBurstAddress } from '../Burst/utils';
import BurstNftPanel from './BurstNftPanel';
import GenericNftPanel from './GenericNftPanel';
import Alert from '../Alert';

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
  const { isLoading, error, data: tokens } = useAccountTokens();
  const [showOnlyBursts, setShowOnlyBursts] = React.useState(true);
  const burstAddress = React.useMemo(() => getBurstAddress({ chainId }), [chainId]);
  const [alert, setAlert] = React.useState({ msg: '', type: '' });

  // console.log(tokens);
  const handleChangeShowBursts = (e) => {
    setShowOnlyBursts(e.target.checked);
  };

  if (isLoading)
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );

  if (error) return <ErrorAlert text='An error occured. Please reload the page and try again.' />;

  return (
    <Wrapper>
      <Card square>
        <Toolbar>
          {
            <FormControlLabel
              control={<Switch checked={showOnlyBursts} onChange={handleChangeShowBursts} name='showBursts' color='primary' />}
              label='Show only BURSTs'
            />
          }
        </Toolbar>
      </Card>
      {isLoading ? (
        <Card>
          <CardContent>Loading...</CardContent>
        </Card>
      ) : (
        <>
          {tokens.byId[burstAddress]?.nft_data.map((data) => (
            <BurstNftPanel data={data} key={data.token_id} setAlert={setAlert} />
          ))}
          {!showOnlyBursts && tokens.nftIds.filter((id) => id !== burstAddress).map((id) => <GenericNftPanel data={tokens.byId[id]} key={id} />)}
        </>
      )}
      <Alert text={alert.msg} open={!!alert.msg} severity={alert.type} destroyAlert={() => setAlert({ msg: '', type: '' })} />
    </Wrapper>
  );
}

export default ManageBurstsCard;
