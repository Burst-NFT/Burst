import React from 'react';
import styled from 'styled-components';
import MetaMaskButton from './MetaMaskButton';

const StyledHeader = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 64px;
`;

const Address = styled.div`
  margin-top: 16px;
`;

function Header() {
  // const displayAddress = !!window.ethereum?.selectedAddress && `${window.ethereum?.selectedAddress.slice(0, -30)}...`;
  return (
    <StyledHeader>
      <MetaMaskButton />
      {/* {displayAddress && <Address>{displayAddress}</Address>} */}
    </StyledHeader>
  );
}

export default Header;
