import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useMoralis } from 'react-moralis';
import { TextField } from '@material-ui/core';
import { useWallet } from './Wallet';
import { DialogCloseButton } from './DialogCloseButton';

interface ProfileDialogComponentProps {
  open: boolean;
  onClose: () => void;
}

const SDialogActions = styled(DialogActions)`
  padding-top: 16px;
  justify-content: center;
`;

const STextField = styled(TextField)`
  /* margin: 8px; */
`;

const SWalletInfo = styled.div`
  background-color: rgb(237, 247, 237);
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 16px;
  span {
    font-style: italic;
  }
`;

const SDialogTitle = styled(DialogTitle)`
  padding-bottom: 0;
`;

function ProfileDialogComponent({ open, onClose: handleClose }: ProfileDialogComponentProps) {
  // couldn't get {user,setUserData} to work
  const { user, setUserData } = useMoralis();
  const { chainId, account } = useWallet();
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    // when opened, grab user data
    if (open) {
      setEmail(user.get('email') || '');
      setUsername(user.get('username') || '');
    }
  }, [open]);

  const handleClickSaveAsync = async () => {
    if (username) {
      await setUserData({ friendlyUsername: username, username: username, email });
    }
  };
  return (
    <Dialog onClose={handleClose} aria-labelledby='profile-dialog' open={open}>
      <form noValidate autoComplete='off'>
        <SDialogTitle id='profile-dialog-title'>
          Profile
          <DialogCloseButton onClose={handleClose} />
        </SDialogTitle>
        <DialogContent>
          <SWalletInfo>
            <div>
              <span>Address:</span> {account}
            </div>
            <div>
              <span>Chain:</span> {chainId}
            </div>
          </SWalletInfo>
          <STextField
            value={username}
            label='Username'
            placeholder='username'
            helperText='Enter a custom username'
            fullWidth
            margin='normal'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e: any) => setUsername(e.target.value)}
            variant='outlined'
          />
          <STextField
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            label='Email'
            placeholder='something@email.com'
            helperText='Enter your email address to receive email notifications'
            fullWidth
            margin='normal'
            InputLabelProps={{
              shrink: true,
            }}
            type='email'
            variant='outlined'
          />
        </DialogContent>
        <SDialogActions>
          <Button onClick={handleClickSaveAsync} color='primary' variant='contained' disableElevation>
            Save
          </Button>
        </SDialogActions>
      </form>
    </Dialog>
  );
}

export const ProfileDialog = React.memo(ProfileDialogComponent);
