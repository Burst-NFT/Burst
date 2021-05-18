import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

import ConnectToWallet from './components/Wallet/ConnectToWallet';
import DisplayBalance from './components/DisplayBalance';

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
  align-items: center;
  > * {
    margin-right: 32px;
  }
`;

const AccountInfo = styled.div`
  display: flex;
  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

const Address = styled.div`
  margin-top: 16px;
`;

const SiteNavLink = styled(Link).attrs({ component: NavLink })`
  color: white;
  /* text-transform: uppercase; */

  &.active {
    h6 {
      font-weight: 600;
    }
  }
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
            {/* @ts-ignore weird error with exact */}
            <SiteNavLink exact to='/'>
              <Typography variant='subtitle1'>Create</Typography>
            </SiteNavLink>
            {/* @ts-ignore weird error with exact */}
            <SiteNavLink exact to='/manage'>
              <Typography variant='subtitle1'>Manage</Typography>
            </SiteNavLink>
          </SiteNav>
          <AccountInfo>
            <DisplayBalance />
            <ConnectToWallet />
            <IconButton href='https://github.com/Burst-NFT/Burst' target='_blank' style={{ color: 'white' }}>
              <GitHubIcon />
            </IconButton>
          </AccountInfo>
        </Toolbar>
      </AppBar>
    </Wrapper>
  );
}

export default Header;
