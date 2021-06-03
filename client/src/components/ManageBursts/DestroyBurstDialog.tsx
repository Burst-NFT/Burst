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

export interface DestroyBurstDialogProps {
  open: boolean;
  handleClose: () => void;
  handleOnClickDestroy: () => void;
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

function DestroyBurstDialog({ open = false, handleClose, handleOnClickDestroy }: DestroyBurstDialogProps) {
  return (
    <Dialog onClose={handleClose} aria-labelledby='simple-dialog-title' open={open}>
      <DialogTitle id='simple-dialog-title'>Destroy</DialogTitle>
      <DialogContent>
        <DialogContentText>Destroy your BURST and claim its contents!</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleOnClickDestroy} color='primary'>
          Destroy
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { DestroyBurstDialog };
