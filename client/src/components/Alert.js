import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert({ text, severity, open, destroyAlert }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    destroyAlert();
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <MuiAlert onClose={handleClose} severity={severity} elevation={6} variant='filled'>
        {text}
      </MuiAlert>
    </Snackbar>
  );
}

export default Alert;
