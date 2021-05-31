import { Typography } from '@material-ui/core';
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
      <Typography variant='caption'>© {currentYear} by Martin Sterlicchi & Justin Hugelen-Padin</Typography>
    </Container>
  );
}

export default Footer;