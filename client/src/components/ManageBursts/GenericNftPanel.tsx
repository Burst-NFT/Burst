import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { Title } from './Title';

interface GenericNftPanelProps {
  name?: string;
  logoUrl?: string;
  address: string;
}

function GenericNftPanelComponent({ name, logoUrl, address }: GenericNftPanelProps) {
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

export const GenericNftPanel = React.memo(GenericNftPanelComponent);
