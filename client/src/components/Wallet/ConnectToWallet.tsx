import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountBoxTwoToneIcon from '@material-ui/icons/AccountBoxTwoTone';
import PowerOffTwoToneIcon from '@material-ui/icons/PowerOffTwoTone';
import styled from 'styled-components';
import { useMoralis } from 'react-moralis';
import { useWallet } from './useWallet';
import React from 'react';
import { ProfileDialog } from '../ProfileDialog';

const SButton = styled(Button)`
  && {
    border: 2px solid black;
    color: black;
    background: white;
  }
`;

const SMenuItemText = styled.span`
  padding-left: 8px;
`;

function ConnectToWallet() {
  const { authenticate, isAuthenticated, user, logout, isAuthenticating } = useMoralis();
  const { web3, account } = useWallet();

  const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const displayAccount = isAuthenticated && account ? `${account.slice(0, 10)}...` : '';
  // console.log('ConnectToWallet.account', account, displayAccount);
  // console.log('authenticate', isAuthenticated, user);

  const handleClickToggleMenu = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);
  const handleCloseProfileDialog = React.useCallback(() => setProfileDialogOpen(false), []);

  const handleClickConnect = () => authenticate();

  const handleClickViewProfile = () => {
    setProfileDialogOpen(true);
    handleCloseMenu();
  };

  const handleClickDisconnectAsync = async () => {
    await logout();
    setAnchorEl(null);
  };
  return !!displayAccount ? (
    <>
      <ProfileDialog open={profileDialogOpen} onClose={handleCloseProfileDialog} />
      <SButton variant='contained' disableElevation endIcon={<ExpandMoreIcon />} onClick={handleClickToggleMenu}>
        {displayAccount}
      </SButton>
      <Menu
        id='profile-menu'
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleClickViewProfile}>
          <AccountBoxTwoToneIcon />
          <SMenuItemText>View Profile</SMenuItemText>
        </MenuItem>
        <MenuItem onClick={handleClickDisconnectAsync} disabled={isAuthenticating}>
          <PowerOffTwoToneIcon />
          <SMenuItemText>Disconnect</SMenuItemText>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <SButton onClick={handleClickConnect} variant='contained' disableElevation>
      Connect
    </SButton>
  );
}

export default ConnectToWallet;
