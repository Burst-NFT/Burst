import React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

import ConnectToWallet from './components/Wallet/ConnectToWallet';
import DisplayBalance from './components/DisplayBalance';

const SMainNav = styled.div`
  height: 111px;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  > a:not(:last-child) {
    margin-right: 48px;
  }
`;

const AccountInfo = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

const SHeader = styled.header`
  display: flex;
`;
const SLogo = styled.div`
  /* padding: 8px; */
  position: absolute;
  top: 8px;
  left: 8px;
`;
const SNavLink = styled.span`
  font-family: 'Bangers', cursive;
  font-weight: 100;
  font-size: 30px;
  text-decoration: none;
  color: black;
  letter-spacing: 0.07rem;
  &.active,
  &:hover {
    text-decoration: underline;
  }
`;

function Header() {
  return (
    <SHeader>
      <SLogo>
        <Link href='/'>
          <img src='/burst_128.png' />
        </Link>
      </SLogo>
      {/* <Avatar alt='BURST' src='/burst_128.png' /> */}

      <SMainNav>
        {/* @ts-ignore weird error with exact */}
        <SNavLink exact to='/' as={NavLink}>
          Create
        </SNavLink>
        <SNavLink exact to='/manage' as={NavLink}>
          Manage
        </SNavLink>
        <SNavLink exact to='/marketplace' as={NavLink}>
          Marketplace
        </SNavLink>
      </SMainNav>
      <AccountInfo>
        <DisplayBalance />
        <ConnectToWallet />
      </AccountInfo>
    </SHeader>
  );
}

export default Header;
