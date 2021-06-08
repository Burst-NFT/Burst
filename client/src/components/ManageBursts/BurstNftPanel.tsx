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

import { useQuotes } from '../../queries';
import useNumberFormatter from '../useNumberFormatter';
import { TokenName } from '../TokenName';
import { Title } from './Title';
import { useWallet } from '../Wallet';
import { SendBurstDialog } from './SendBurstDialog';
import { DestroyBurstDialog } from './DestroyBurstDialog';
import { AlertState } from '.';
import { Burst } from '../Burst';
import { formatUnits } from '@ethersproject/units';
import { getBurstAssetsTotalValue } from './utils';
import { useQueryClient } from 'react-query';
import { createBurstContract, createMarketplaceContract } from '../../utils';
import { SellBurstDialog } from './SellBurstDialog';
import { SPanel } from './styles';

export interface BurstNftPanelProps {
  burst: Burst;
  setAlert: React.Dispatch<AlertState | React.SetStateAction<AlertState>>;
}

const TableCell = styled(MuiTableCell)`
  color: rgba(0, 0, 0, 0.54);
`;

const SPanelActions = styled.div`
  display: flex;
  border-top: 1px solid;
  > button {
    width: 100%;
    border-radius: 0;
    font-weight: 700;
    &:not(:last-child) {
      border-right: solid 1px;
    }
  }
`;

const SPanelActionsContainer = styled.div`
  display: flex;
  /* position: absolute; */
`;

function BurstNftPanelComponent({ burst, setAlert }: BurstNftPanelProps) {
  const { numberFormatter } = useNumberFormatter();
  const { web3, chainId, account } = useWallet();
  // don't retry fetching quotes if it fails on the first go
  const { isLoading, data: priceQuotes } = useQuotes({ addresses: burst.assets.allIds, options: { retry: false } });
  const queryClient = useQueryClient();
  /**
   *
   */
  const totalBurstAssetValue: string = React.useMemo(
    () =>
      !!priceQuotes?.allIds.length
        ? numberFormatter.format(getBurstAssetsTotalValue({ priceQuotesById: priceQuotes.byId, burstAssets: burst.assets }))
        : '$0.00',
    [numberFormatter, priceQuotes, burst]
  );

  const [sendDialogOpen, setSendDialogOpen] = React.useState(false);
  const [sendDialogAddressValue, setSendDialogAddressValue] = React.useState('');
  const [destroyDialogOpen, setDestroyDialogOpen] = React.useState(false);
  const [sellDialogOpen, setSellDialogOpen] = React.useState(false);

  // handlers
  const handleOnClickSendAsync = async () => {
    const burstContract = createBurstContract({ web3, chainId });
    const response = await burstContract.methods.transferFrom(account, sendDialogAddressValue, burst.id).send({ from: account });
    // console.log('handleOnClickSendAsync', response);
    setAlert({ msg: `1 BURST (#${burst.id}) successfully sent to '${sendDialogAddressValue}'` });
    await queryClient.refetchQueries(['bursts']);
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
    const response = await burstContract.methods.destroyBurst(burst.id).send({ from: account });
    // console.log('handleOnClickDestroyAsync', response);
    setAlert({ msg: `1 BURST (#${burst.id}) successfully destroyed` });
    await queryClient.refetchQueries(['bursts']);
  };

  const handleClickSell = () => setSellDialogOpen(true);
  const handleCloseSellBurstDialog = () => setSellDialogOpen(false);

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
      <DestroyBurstDialog open={destroyDialogOpen} handleClose={handleCloseDestroyDialog} handleOnClickDestroy={handleOnClickDestroyAsync} />
      <SellBurstDialog open={sellDialogOpen} onClose={handleCloseSellBurstDialog} burst={burst} />
      <SPanel>
        <Title>
          <Badge
            overlap='circle'
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={burst.assets.allIds.length}
            color='secondary'
            // style={{ backgroundColor: 'black' }}
          >
            <Avatar alt='B' src={burst.logoUrl || ''} />
          </Badge>

          {!isLoading && (
            <Typography color='textSecondary' variant='body2'>
              {totalBurstAssetValue}
            </Typography>
          )}
        </Title>
        <Divider />
        <TableContainer>
          <Table size='small'>
            {/* <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell align='right'>Amount</TableCell>
                <TableCell align='right'>Est. Value ($)</TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {burst.assets?.allIds.map((id) => {
                const { symbol, address, logoUrl, decimals, balance } = burst.assets.byId[id];
                const amount = parseFloat(formatUnits(balance, decimals));
                const totalValue = amount * (priceQuotes?.byId[address]?.quote || 0);
                return (
                  <TableRow key={id}>
                    <TableCell align='left'>
                      <TokenName symbol={symbol} address={address} logo={logoUrl} />
                    </TableCell>
                    <TableCell align='right'>{amount}</TableCell>
                    <TableCell align='right'>{totalValue ? numberFormatter.format(totalValue) : '-'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <SPanelActionsContainer>
          <SPanelActions>
            <Button size='small' color='default' onClick={handleClickSell}>
              Sell
            </Button>
            <Button size='small' color='default' onClick={() => setDestroyDialogOpen(true)}>
              Destory
            </Button>
            <Button size='small' color='primary' onClick={() => setSendDialogOpen(true)}>
              Send
            </Button>
          </SPanelActions>
        </SPanelActionsContainer>
      </SPanel>
    </>
  );
}

export const BurstNftPanel = React.memo(BurstNftPanelComponent);
