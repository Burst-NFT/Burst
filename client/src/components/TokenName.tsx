import React from 'react';
import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const StyledTokenName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > span {
    padding-left: 8px;
  }
`;

export interface TokenNameProps {
  logo?: string;
  symbol: string;
}

export const TokenName = React.memo(function TokenName({ logo = '', symbol }: TokenNameProps) {
  return (
    <StyledTokenName>
      <Avatar alt={symbol} src={logo}>
        <HelpOutlineIcon />
      </Avatar>
      <span>{symbol}</span>
    </StyledTokenName>
  );
});
