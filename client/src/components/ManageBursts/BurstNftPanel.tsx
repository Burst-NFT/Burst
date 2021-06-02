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
import Title from './Title';
import { useWallet } from '../Wallet';
import { createBurstContract } from '../Burst/utils';
import SendBurstDialog from './SendBurstDialog';
import DestoryBurstDialog from './DestroyBurstDialog';
import { AlertState } from './';
import { Burst } from '../Burst';
import { formatUnits } from '@ethersproject/units';
import { getBurstAssetsTotalValue } from './utils';

export interface BurstNftPanelProps {
  burst: Burst;
  setAlert: React.Dispatch<AlertState | React.SetStateAction<AlertState>>;
}

const TableCell = styled(MuiTableCell)`
  color: rgba(0, 0, 0, 0.54);
`;

function BurstNftPanel({ burst, setAlert }: BurstNftPanelProps) {
  const { web3, chainId, account } = useWallet();
  const { isLoading, data: priceQuotes } = useQuotes({ addresses: burst.assets.allIds });

  // filter attributes to only include valid tokens
  // const assets = React.useMemo(() => data.external_data?.attributes?.filter((attr) => !!attr.token_address && !!attr.token_symbol) || [], [data]);
  // const { isLoading, data: spotPrices } = useBurstAssetPrices({ burstAssets: assets });
  const { numberFormatter } = useNumberFormatter();
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

  // handlers
  const handleOnClickSendAsync = async () => {
    const burstContract = createBurstContract({ web3, chainId });
    const response = await burstContract.methods.transferFrom(account, sendDialogAddressValue, burst.id).send({ from: account });
    // console.log('handleOnClickSendAsync', response);
    setAlert({ msg: `1 BURST (#${burst.id}) successfully sent to '${sendDialogAddressValue}'` });
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
    const response = await burstContract.methods.destroyBurstWithMultiERC20(burst.id).send({ from: account });
    // console.log('handleOnClickDestroyAsync', response);
    setAlert({ msg: `1 BURST (#${burst.id}) successfully destroyed` });
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
            badgeContent={burst.assets.byId.size}
            color='secondary'
          >
            <Avatar alt='B' src={burst.logoUrl || ''} />
          </Badge>
          <Title>
            <Typography>Burst NFT</Typography>
            {!isLoading && (
              <Typography color='textSecondary' variant='body2'>
                Est value: {totalBurstAssetValue}
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
                  <TableRow>
                    <TableCell rowSpan={3} style={{ borderBottom: 'none' }} />
                    <TableCell align='right'>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align='right'>
                      <strong>{totalBurstAssetValue}</strong>
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
