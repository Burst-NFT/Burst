import React from 'react';
import styled from 'styled-components';
import MetaMaskButton from './MetaMaskButton';

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  margin-bottom: 64px;
`;

function Header() {
  return (
    <StyledHeader>
      <MetaMaskButton />
    </StyledHeader>
  );
}

export default Header;
