import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useWallet } from '../Wallet';

export interface SendBurstDialogProps {
  open: boolean;
  handleClose: () => void;
  handleOnClickSend: () => void;
  sendDialogAddressValue: string;
  setSendDialogAddressValue: (address: string) => void;
}

const Dialog = styled(MuiDialog)``;

const DialogActions = styled(MuiDialogActions)`
  padding-top: 16px;
  /* justify-content: center; */
`;

// used https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=4CAF50 to generate color
// const OkButton = styled(Button)`
//   background-color: #4caf50;
//   &:hover {
//     background-color: #087f23;
//   }
// `;

function SendBurstDialog({ open = false, handleClose, handleOnClickSend, sendDialogAddressValue, setSendDialogAddressValue }: SendBurstDialogProps) {
  const { web3 } = useWallet();
  return (
    <Dialog onClose={handleClose} aria-labelledby='simple-dialog-title' open={open}>
      <DialogTitle id='simple-dialog-title'>Send</DialogTitle>
      <DialogContent>
        <DialogContentText>Send your burst token to the following address:</DialogContentText>
        <TextField
          variant='outlined'
          autoFocus
          margin='dense'
          id='name'
          label='Address'
          type='text'
          value={sendDialogAddressValue}
          onChange={(e) => {
            setSendDialogAddressValue(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleOnClickSend} color='primary' disabled={!web3.utils.isAddress(sendDialogAddressValue)}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { SendBurstDialog };
