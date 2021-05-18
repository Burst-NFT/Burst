import React from 'react';
import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

import { useBurstAssetPrices } from '../queries';
import useNumberFormatter from '../useNumberFormatter';
import TokenName from '../TokenName';
import Title from './Title';
import useWallet from '../Wallet/useWallet';
import { createBurstContract, BurstCreationData } from '../Burst/utils';
import SendBurstDialog from './SendBurstDialog';
import DestoryBurstDialog from './DestroyBurstDialog';
import { AlertState } from './';
import { NftData } from '../../api/fetchAccountTokens';

export interface BurstNftPanelProps {
  data: NftData;
  setAlert: React.Dispatch<AlertState | React.SetStateAction<AlertState>>;
}

const TableCell = styled(MuiTableCell)`
  color: rgba(0, 0, 0, 0.54);
`;

function BurstNftPanel({ data, setAlert }: BurstNftPanelProps) {
  const { web3, chainId, account } = useWallet();
  // filter attributes to only include valid tokens
  const assets = React.useMemo(() => data.external_data?.attributes?.filter((attr) => !!attr.token_address && !!attr.token_symbol) || [], [data]);
  const { isLoading, data: burstAssets } = useBurstAssetPrices({ burstAssets: assets });
  const { numberFormatter } = useNumberFormatter();
  const totalValue = React.useMemo(
    () =>    
      !!burstAssets?.allIds.length
        ? numberFormatter?.format(burstAssets.allIds.reduce((sum, id) => sum + burstAssets.byId[id].totalValue, 0))
        : '$0.00',
    [numberFormatter, burstAssets]
  );

  const [sendDialogOpen, setSendDialogOpen] = React.useState(false);
  const [sendDialogAddressValue, setSendDialogAddressValue] = React.useState('');
  const [destroyDialogOpen, setDestroyDialogOpen] = React.useState(false);

  // handlers
  const handleOnClickSendAsync = async () => {
    const burstContract = createBurstContract({ web3, chainId });
    const response = await burstContract.methods.transferFrom(account, sendDialogAddressValue, data.token_id).send({ from: account });
    // console.log('handleOnClickSendAsync', response);
    setAlert({ msg: `1 BURST (#${data.token_id}) successfully sent to '${sendDialogAddressValue}'` });
    handleCloseSendDialog();
  };
  const handleCloseSendDialog = () => {
    setSendDialogOpen(false);
    setSendDialogAddressValue('');
  };

  const handleCloseDestroyDialog = () => {
    setDestroyDialogOpen(false);
  };

  const handleOnClickDestroyAsync = async () => {
    const burstContract = createBurstContract({ web3, chainId });
    const response = await burstContract.methods.destroyBurstWithMultiERC20(data.token_id).send({ from: account });
    // console.log('handleOnClickDestroyAsync', response);
    setAlert({ msg: `1 BURST (#${data.token_id}) successfully destroyed` });
  };

  const sendDialogProps = {
    sendDialogAddressValue,
    setSendDialogAddressValue,
    handleOnClickSend: handleOnClickSendAsync,
    handleClose: handleCloseSendDialog,
    open: sendDialogOpen,
  };

  return (
    <>
      <SendBurstDialog {...sendDialogProps} />
      <DestoryBurstDialog open={destroyDialogOpen} handleClose={handleCloseDestroyDialog} handleOnClickDestroy={handleOnClickDestroyAsync} />
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-label='Expand' aria-controls='additional-content'>
          <Badge
            overlap='circle'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={assets.length}
            color='secondary'
          >
            <Avatar alt='B' src={data.external_data?.image || ''} />
          </Badge>
          <Title>
            <Typography>Burst NFT</Typography>
            {!isLoading && (
              <Typography color='textSecondary' variant='body2'>
                Est value: {totalValue}
              </Typography>
            )}
          </Title>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <TableContainer>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell align='right'>Amount</TableCell>
                    <TableCell align='right'>Est. Value ($)</TableCell>
                    <TableCell align='right'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {burstAssets?.allIds.map((id) => (
                    <TableRow key={id}>
                      <TableCell align='left'>
                        <TokenName symbol={burstAssets.byId[id].symbol} logo={burstAssets.byId[id].logo} />
                      </TableCell>
                      <TableCell align='right'>{burstAssets.byId[id].amount}</TableCell>
                      <TableCell align='right'>{numberFormatter?.format(burstAssets.byId[id].totalValue)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell rowSpan={3} style={{ borderBottom: 'none' }} />
                    <TableCell align='right'>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align='right'>
                      <strong>{totalValue}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Button size='small' color='default' onClick={() => setDestroyDialogOpen(true)}>
            Destory
          </Button>
          <Button size='small' color='primary' onClick={() => setSendDialogOpen(true)}>
            Send
          </Button>
        </AccordionActions>
      </Accordion>
    </>
  );
}

export default React.memo(BurstNftPanel);
