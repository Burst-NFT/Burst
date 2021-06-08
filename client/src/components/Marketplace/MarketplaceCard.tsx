import React from 'react';
import styled from 'styled-components';

interface MarketplaceCardComponentProps {
  data: any;
}

function MarketplaceCardComponent({ data }: MarketplaceCardComponentProps) {
  return <p>{data.tokenId}</p>;
}

export const MarketplaceCard = React.memo(MarketplaceCardComponent);
