import React from 'react';
import styled from 'styled-components';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Title from './Title';

function GenericNftPanel({ data }) {
  return (
    <Accordion>
      <AccordionSummary>
        <Avatar alt={data.contract_name} src={data.external_data?.image} />
        <Title>
          <Typography>data.contract_name</Typography>
          <Typography color='textSecondary'>{data.contract_address}</Typography>
        </Title>
      </AccordionSummary>
    </Accordion>
  );
}

export default React.memo(GenericNftPanel);
