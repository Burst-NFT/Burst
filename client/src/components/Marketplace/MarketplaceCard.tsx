import React from 'react';
import styled from 'styled-components';
import { MoralisMarketplaceOrderCreatedEventObjectAttributes, MoralisParseObject } from './Page';

interface MarketplaceCardComponentProps {
  data: MoralisParseObject<MoralisMarketplaceOrderCreatedEventObjectAttributes>;
}

function MarketplaceCardComponent({ data }: MarketplaceCardComponentProps) {
  // console.log(data);
  return <p>{data.id}</p>;
}

export const MarketplaceCard = React.memo(MarketplaceCardComponent);
