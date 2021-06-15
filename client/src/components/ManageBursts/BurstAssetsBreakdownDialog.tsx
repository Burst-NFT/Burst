import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Burst } from '../Burst';
import { useQuotes } from '../../queries';
import { formatUnits } from '@ethersproject/units';
import { TokenName } from '../TokenName';
import useNumberFormatter from '../useNumberFormatter';
import { getBurstAssetsTotalValue } from './utils';
import { Ether } from '../../data/tokenInfo';
import { DialogCloseButton } from '../DialogCloseButton';

export interface BurstAssetsBreakdownDialogProps {
  open: boolean;
  onClose: () => void;
  burst: Burst;
}

const SDialog = styled(MuiDialog)``;

const SDialogActions = styled(MuiDialogActions)`
  padding-top: 16px;
`;

const STableCell = styled(MuiTableCell)`
  /* color: rgba(0, 0, 0, 0.54); */
`;

const STableHead = styled(TableHead)`
  ${STableCell} {
    font-weight: bold;
  }
`;

function BurstAssetsBreakdownDialogComponent({ open = false, onClose: handleClose, burst }: BurstAssetsBreakdownDialogProps) {
  const { numberFormatter } = useNumberFormatter();
  const { isLoading, data: priceQuotes } = useQuotes({ addresses: burst.assets.allIds.concat(Ether.address as string), options: { retry: false } });

  const totalBurstAssetValue = React.useMemo(
    () => (!!priceQuotes?.allIds.length ? getBurstAssetsTotalValue({ priceQuotesById: priceQuotes.byId, burstAssets: burst.assets }) : 0),
    [priceQuotes, burst]
  );

  const etherQuote = priceQuotes?.byId[Ether.address as string]?.quote;
  return (
    <SDialog onClose={handleClose} open={open} maxWidth='lg'>
      <DialogTitle>
        Burst Assets
        <DialogCloseButton onClose={handleClose} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TableContainer style={{ margin: '16px' }}>
          <Table size='small'>
            <STableHead>
              <TableRow>
                <STableCell>Symbol</STableCell>
                <STableCell>Address</STableCell>
                <STableCell align='right'>Amount</STableCell>
                <STableCell align='right'>Est. Value</STableCell>
                <STableCell align='right'></STableCell>
              </TableRow>
            </STableHead>
            <TableBody>
              {burst.assets?.allIds.map((id) => {
                const { symbol, address, logoUrl, decimals, balance } = burst.assets.byId[id];
                const amount = parseFloat(formatUnits(balance, decimals));
                const totalValue = amount * (priceQuotes?.byId[address]?.quote || 0);
                return (
                  <TableRow key={id}>
                    <STableCell align='left'>
                      <TokenName symbol={symbol} address={address} logo={logoUrl} />
                    </STableCell>
                    <STableCell align='right'>{address}</STableCell>
                    <STableCell align='right'>{amount}</STableCell>
                    <STableCell align='right'>{totalValue ? numberFormatter.format(totalValue) : '-'}</STableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <STableCell style={{ borderBottom: 'none' }} />
                <STableCell style={{ borderBottom: 'none' }} />
                <STableCell align='right' style={{ borderBottom: 'none' }}>
                  <strong>Total Estimated Value</strong>
                </STableCell>
                <STableCell align='right' style={{ borderBottom: 'none' }}>
                  <strong>
                    {numberFormatter.format(totalBurstAssetValue)} ≈ {etherQuote ? totalBurstAssetValue / etherQuote : 0} ETH{' '}
                  </strong>
                </STableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </SDialog>
  );
}

export const BurstAssetsBreakdownDialog = BurstAssetsBreakdownDialogComponent;
