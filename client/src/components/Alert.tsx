import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { Color } from '@material-ui/lab/Alert';

export interface AlertProps {
  text: string;
  severity: Color | undefined;
  open?: boolean;
  destroyAlert: () => void;
}

function Alert({ text, severity, open, destroyAlert }: AlertProps) {
  const handleClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    destroyAlert();
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      {/* @ts-ignore expects a different onClose fn signature */}
      <MuiAlert onClose={handleClose} severity={severity} elevation={6} variant='filled'>
        {text}
      </MuiAlert>
    </Snackbar>
  );
}

export default Alert;
