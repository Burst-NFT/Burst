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
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import { useWallet } from '../Wallet';
import useNumberFormatter from '../useNumberFormatter';
import TokenName from '../TokenName';

const Dialog = styled(MuiDialog)``;

const DialogActions = styled(MuiDialogActions)`
  padding-top: 16px;
  justify-content: center;
`;

const TableCell = styled(MuiTableCell)`
  color: rgba(0, 0, 0, 0.54);
`;
// used https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=4CAF50 to generate color
const OkButton = styled(Button)`
  background-color: #4caf50;
  &:hover {
    background-color: #087f23;
  }
`;

export interface CreateSuccessDialogProps {
  open: boolean;
  handleClose: () => void;
  data: any;
}

function CreateSuccessDialog({ open, handleClose, data: { basket, result } }: CreateSuccessDialogProps) {
  const { network } = useWallet();
  const { numberFormatter } = useNumberFormatter();
  // console.log('result', result);

  return (
    <Dialog
      open={open}
      TransitionComponent={Zoom}
      keepMounted
      onClose={handleClose}
      aria-labelledby='alert-dialog-create-burst-success'
      aria-describedby='alert-dialog-create-burst-success-description'
    >
      <DialogTitle id='alert-dialog-create-burst-success-title' disableTypography>
        <Typography variant='h4' align='center'>
          Success!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color='textPrimary' id='alert-dialog-create-burst-success-description'>
          1 BURST was successfully created on the '{network?.name}' network!
        </DialogContentText>
        <TableContainer>
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
              {basket.allIds.map((id: string) => (
                <TableRow key={id}>
                  <TableCell align='left'>
                    <TokenName symbol={basket.byId[id].symbol} logo={basket.byId[id].logo} />
                  </TableCell>
                  <TableCell align='right'>{basket.byId[id].amount}</TableCell>
                  <TableCell align='right'>{numberFormatter?.format(basket.byId[id].total)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell align='right'>
                  <strong>Total</strong>
                </TableCell>
                <TableCell align='right'>
                  <strong>{numberFormatter?.format(basket.allIds.reduce((sum: number, id: string) => sum + basket.byId[id].total, 0))}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <OkButton onClick={handleClose} variant='contained' size='large' color='primary' disableElevation>
          Okay
        </OkButton>
      </DialogActions>
    </Dialog>
  );
}

export default CreateSuccessDialog;
