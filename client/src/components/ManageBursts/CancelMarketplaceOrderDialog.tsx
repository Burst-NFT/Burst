import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface CancelMarketplaceOrderDialogComponentProps {
  open: boolean;
  onClickClose: () => void;
  onClickConfirm: () => void;
}

const Dialog = styled(MuiDialog)``;

const DialogActions = styled(MuiDialogActions)`
  padding-top: 16px;
`;

function CancelMarketplaceOrderDialogComponent({
  open = false,
  onClickClose: handleClose,
  onClickConfirm: handleClickConfirm,
}: CancelMarketplaceOrderDialogComponentProps) {
  return (
    <Dialog onClose={handleClose} aria-labelledby='cancel-order-dialog-title' open={open}>
      <DialogTitle id='cancel-order-dialog-title'>Cancel Marketplace Order</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to cancel your marketplace order?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClickConfirm} color='primary' variant='contained' disableElevation>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const CancelMarketplaceOrderDialog = CancelMarketplaceOrderDialogComponent;
