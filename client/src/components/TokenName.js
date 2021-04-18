import React from 'react';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';

const StyledTokenName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > span {
    padding-left: 8px;
  }
`;

function TokenName({ logo, symbol }) {
  return (
    <StyledTokenName>
      <Avatar alt={symbol} src={logo} />
      <span>{symbol}</span>
    </StyledTokenName>
  );
}

export default React.memo(TokenName);
