import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import MuiAppBar from '@material-ui/core/AppBar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { useNftTokensWithValue } from '../queries';
import useWallet from '../Wallet/useWallet';
import ErrorAlert from '../ErrorAlert';
import { getBurstAddress } from '../Burst/utils';

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

const Title = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-left: 16px;
`;

// const Toolbar = styled(MuiToolbar)

const Wrapper = styled.div`
  min-width: 600px;
`;

const AppBar = styled(MuiAppBar)`
  margin-bottom: 16px;
`;
const initialState = {
  byId: {},
  allIds: [],
  burstIds: [],
};
function ManageBurstsCard() {
  const { web3, account, network, chainId } = useWallet();
  // const { isLoading, error, data: tokens } = useNftTokensWithValue();
  const [showOnlyBursts, setShowOnlyBursts] = React.useState(true);
  const burstAddress = React.useMemo(() => getBurstAddress({ chainId }), [chainId]);
  const [displayTokens, setDisplayTokens] = React.useState({ ...initialState });

  const handleChangeShowBursts = (e) => {
    setShowOnlyBursts(e.target.checked);
  };

  const isLoading = false;
  // React.useEffect(() => {}, [tokens, burstAddress]);
  // if (isLoading)
  //   return (
  //     <Card>
  //       <CardContent>Loading...</CardContent>
  //     </Card>
  //   );

  // if (error) return <ErrorAlert text='An error occured. Please reload the page and try again.' />;

  return (
    <Wrapper>
      <Card square>
        <Toolbar>
          <FormControlLabel
            control={<Switch checked={showOnlyBursts} onChange={handleChangeShowBursts} name='showBursts' color='primary' />}
            label='Show only BURSTs'
          />
        </Toolbar>
      </Card>
      {isLoading ? (
        <Card>
          <CardContent>Loading...</CardContent>
        </Card>
      ) : (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label='Expand'
            aria-controls='additional-actions1-content'
            id='additional-actions1-header'
          >
            <Badge
              overlap='circle'
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              badgeContent={4}
              color='secondary'
            >
              <Avatar alt='B' src='/static/images/avatar/2.jpg' />
            </Badge>
            <Title>
              <Typography>BURST NFT</Typography>
              <Typography color='textSecondary'>Est value: $24.00</Typography>
            </Title>
          </AccordionSummary>
        </Accordion>
      )}
    </Wrapper>
  );
}

export default ManageBurstsCard;
