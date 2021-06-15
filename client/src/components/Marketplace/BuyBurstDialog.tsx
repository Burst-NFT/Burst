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
import { BurstMarketplaceOrder } from '.';
import DialogActions from '@material-ui/core/DialogActions';

export interface BuyBurstDialogProps {
  open: boolean;
  onClose: () => void;
  onClickConfirm: () => void | Promise<void>;
  burstMarketplaceOrder: BurstMarketplaceOrder;
  totalUSDValue: string;
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

function BuyBurstDialogComponent({
  open = false,
  onClose: handleClose,
  burstMarketplaceOrder,
  totalUSDValue,
  onClickConfirm: handleClickConfirm,
}: BuyBurstDialogProps) {
  const { numberFormatter } = useNumberFormatter();

  return (
    <SDialog onClose={handleClose} open={open} maxWidth='lg'>
      <DialogTitle>
        Purchase Order
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
              </TableRow>
            </STableHead>
            <TableBody>
              {burstMarketplaceOrder.assets?.map((asset) => {
                const { symbol, address, logoUrl, decimals, balance } = asset;
                const amount = parseFloat(formatUnits(balance, decimals));
                return (
                  <TableRow key={asset.address}>
                    <STableCell align='left'>
                      <TokenName symbol={symbol} address={address} logo={logoUrl} />
                    </STableCell>
                    <STableCell align='left'>{address}</STableCell>
                    <STableCell align='right'>{amount}</STableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <STableCell style={{ borderBottom: 'none' }} />
                <STableCell align='right' style={{ borderBottom: 'none' }}>
                  <strong>Purchase Price: </strong>
                </STableCell>
                <STableCell align='right' style={{ borderBottom: 'none' }}>
                  <strong>
                    ETH {burstMarketplaceOrder.price} ≈ {totalUSDValue}
                  </strong>
                </STableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClickConfirm} color='primary' variant='contained' disableElevation>
          Confirm Purchase
        </Button>
      </DialogActions>
    </SDialog>
  );
}

export const BuyBurstDialog = BuyBurstDialogComponent;
