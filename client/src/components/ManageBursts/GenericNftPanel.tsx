import React from 'react';
import styled from 'styled-components';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Title from './Title';
import { NftData, TokenBalance } from '../../api/fetchAccountTokens';

interface GenericNftPanel {
  name?: string;
  logoUrl?: string;
  address: string;
}

function GenericNftPanel({ name, logoUrl, address }: GenericNftPanel) {
  if (!address) return null;
  return (
    <Accordion>
      <AccordionSummary>
        <Avatar alt={name} src={logoUrl} />
        <Title>
          <Typography>{name}</Typography>
          <Typography color='textSecondary'>{address}</Typography>
        </Title>
      </AccordionSummary>
    </Accordion>
  );
}

export default React.memo(GenericNftPanel);
