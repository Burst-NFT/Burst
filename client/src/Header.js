import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';
import MetaMaskButton from './MetaMaskButton';

const StyledHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 16px; */
  margin-bottom: 64px;
  padding: 16px;
`;

const Address = styled.div`
  margin-top: 16px;
`;

function Header() {
  // const displayAddress = !!window.ethereum?.selectedAddress && `${window.ethereum?.selectedAddress.slice(0, -30)}...`;
  return (
    <StyledHeader>
      <Avatar alt='BURST' src='/burst40.png' />
      <MetaMaskButton />
      <IconButton href='https://github.com/Burst-NFT/Burst' target='_blank' color='primary'>
        <GitHubIcon />
      </IconButton>
    </StyledHeader>
  );
}

export default Header;
