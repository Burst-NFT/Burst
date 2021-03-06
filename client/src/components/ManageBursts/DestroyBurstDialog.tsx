import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface DestroyBurstDialogComponentProps {
  open: boolean;
  onClickClose: () => void;
  onClickConfirm: () => void;
}

const Dialog = styled(MuiDialog)``;

const DialogActions = styled(MuiDialogActions)`
  padding-top: 16px;
`;

function DestroyBurstDialogComponent({
  open = false,
  onClickClose: handleClose,
  onClickConfirm: handleClickConfirm,
}: DestroyBurstDialogComponentProps) {
  return (
    <Dialog onClose={handleClose} aria-labelledby='destroy-dialog-title' open={open}>
      <DialogTitle id='destroy-dialog-title'>Destroy</DialogTitle>
      <DialogContent>
        <DialogContentText>Destroy your BURST and claim its contents!</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClickConfirm} color='primary' variant='contained' disableElevation>
          Destroy
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const DestroyBurstDialog = DestroyBurstDialogComponent;
