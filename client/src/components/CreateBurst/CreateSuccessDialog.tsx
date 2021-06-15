import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import { useWallet } from '../Wallet';
import useNumberFormatter from '../useNumberFormatter';
import { TokenName } from '../TokenName';
import { BasketState } from './types';
import { formatUnits } from '@ethersproject/units';
import { useQuotes, UseQuotesResult } from '../../queries/useQuotes';

const Dialog = styled(MuiDialog)``;

const DialogActions = styled(MuiDialogActions)`
  padding-top: 16px;
  justify-content: center;
`;

const STableCell = styled(TableCell)`
  /* color: rgba(0, 0, 0, 0.54); */
`;
// used https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=4CAF50 to generate color
const OkButton = styled(Button)`
  /* background-color: #4caf50;
  &:hover {
    background-color: #087f23;
  } */
`;

const STableHead = styled(TableHead)`
  ${STableCell} {
    font-weight: bold;
  }
`;

export interface SuccessDialogData {
  basket: BasketState;
  /**
   * web3/ethers create result
   */
  result?: any;
}

export interface CreateSuccessDialogProps {
  open: boolean;
  handleClose: () => void;
  data: SuccessDialogData;
}

export function CreateSuccessDialog({ open, handleClose, data: { basket } }: CreateSuccessDialogProps) {
  const { network } = useWallet();
  const { numberFormatter } = useNumberFormatter();
  const { data: priceQuotes } = useQuotes({ addresses: basket.allIds });

  const totalBurstAssetValue: string = React.useMemo(
    () =>
      !!priceQuotes?.allIds.length
        ? numberFormatter.format(
            basket.allIds.reduce<number>((sum: number, addr: string) => {
              const quote = priceQuotes.byId[addr]?.quote || 0;
              sum += quote * basket.byId[addr].amount;
              return sum;
            }, 0)
          )
        : '$0.00',
    [numberFormatter, priceQuotes, basket]
  );

  return (
    <Dialog
      open={open}
      TransitionComponent={Zoom}
      keepMounted
      onClose={handleClose}
      aria-labelledby='alert-dialog-create-burst-success'
      aria-describedby='alert-dialog-create-burst-success-description'
    >
      <DialogTitle id='alert-dialog-create-burst-success-title'>
        <Typography variant='h5' align='center'>
          Success!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color='textPrimary' id='alert-dialog-create-burst-success-description'>
          <i>BURST was successfully created on the '{network?.name}' network!</i>
        </DialogContentText>
        <TableContainer>
          <Table size='small'>
            <STableHead>
              <TableRow>
                <STableCell>Token</STableCell>
                <STableCell align='right'>Amount</STableCell>
                <STableCell align='right'>Est. Value ($)</STableCell>
                <STableCell align='right'></STableCell>
              </TableRow>
            </STableHead>
            <TableBody>
              {basket.allIds.map((id: string) => {
                const { symbol, address, logoUrl, amount } = basket.byId[id];
                const totalValue = amount * (priceQuotes?.byId[address]?.quote || 0);
                return (
                  <TableRow key={id}>
                    <STableCell align='left'>
                      <TokenName symbol={symbol} logo={logoUrl} address={address} />
                    </STableCell>
                    <STableCell align='right'>{amount}</STableCell>
                    <STableCell align='right'>{totalValue ? numberFormatter.format(totalValue) : '-'}</STableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <STableCell rowSpan={3} style={{ borderBottom: 'none' }} />
                <STableCell align='right' style={{ borderBottom: 'none' }}>
                  <strong>Total</strong>
                </STableCell>
                <STableCell align='right' style={{ borderBottom: 'none' }}>
                  <strong>{totalBurstAssetValue}</strong>
                </STableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <OkButton onClick={handleClose} variant='contained' color='primary' disableElevation>
          Okay
        </OkButton>
      </DialogActions>
    </Dialog>
  );
}
