import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export interface ErrorAlertProps {
  text: string;
  open?: boolean;
}
function ErrorAlert({ text, open: _open = true }: ErrorAlertProps) {
  const [open, setOpen] = React.useState(_open);

  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      {/* @ts-ignore expects a different onClose fn signature */}
      <Alert onClose={handleClose} severity="error" elevation={6} variant="filled">
        {text}
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;
