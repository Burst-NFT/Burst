import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import React from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  background-color: #fff;
  /* border: 1px solid gray; */
  padding: 16px;
  margin-top: 64px;
  display: flex;
  align-items: center;
  /* position: absolute; */
  bottom: 0;
  width: 100%;
`;

function Footer() {
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);

  return (
    <Container>
      <div style={{ width: '100%' }}>
        <Typography variant='caption'>© {currentYear} by Martin Sterlicchi & Justin Hugelen-Padin</Typography>
      </div>
      <IconButton href='https://github.com/Burst-NFT/Burst' target='_blank'>
        <GitHubIcon />
      </IconButton>
    </Container>
  );
}

export default Footer;
