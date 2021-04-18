import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

function ErrorAlert({ text, open: _open = true }) {
  const [open, setOpen] = React.useState(_open);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" elevation={6} variant="filled">
        {text}
      </Alert>
    </Snackbar>
  );
}

export default ErrorAlert;
