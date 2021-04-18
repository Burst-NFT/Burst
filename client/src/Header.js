import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';
import ConnectToWallet from './components/Wallet/ConnectToWallet';

const StyledHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 16px; */
  margin-bottom: 64px;
  padding: 16px;
`;

const Wrapper = styled.div`
  margin-bottom: 64px;
`;

const SiteNav = styled.div`
  display: flex;
  flex-grow: 1;
`;

const AccountInfo = styled.div`
  display: flex;
`;

const Address = styled.div`
  margin-top: 16px;
`;

function Header() {
  // const displayAddress = !!window.ethereum?.selectedAddress && `${window.ethereum?.selectedAddress.slice(0, -30)}...`;
  return (
    <Wrapper>
      <AppBar position='static'>
        <Toolbar>
          <SiteNav>
            <Link href='/'>
              <Avatar alt='BURST' src='/burst40.png' />
            </Link>
          </SiteNav>
          <AccountInfo>
            <ConnectToWallet />
            <IconButton href='https://github.com/Burst-NFT/Burst' target='_blank' color='primary'>
              <GitHubIcon />
            </IconButton>
          </AccountInfo>
        </Toolbar>
      </AppBar>
    </Wrapper>
  );
}

export default Header;
