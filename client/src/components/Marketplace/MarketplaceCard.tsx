import React from 'react';
import styled from 'styled-components';
import FavoriteBorderTwoToneIcon from '@material-ui/icons/FavoriteBorderTwoTone';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import IconButton from '@material-ui/core/IconButton';
import MuiTableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';

import { useQuoteByTickers, useQuotes } from '../../queries';
import useNumberFormatter from '../useNumberFormatter';
import { useWallet } from '../Wallet';
import { BurstMarketplaceOrder } from '.';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { useQueryClient } from 'react-query';
import { createBurstContract, createMarketplaceContract } from '../../utils';
import { SBurstCard, SBurstCardContent, SChartTotalContainer } from '../ManageBursts/styles';
import { BurstAssetChart, BurstAssetChartDataItem } from '../BurstAssetChart';
import { Colors } from '../styles';
import { BurstAssetsBreakdownDialog } from './BurstAssetsBreakdownDialog';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { BuyBurstDialog } from './BuyBurstDialog';
import { Ether } from '../../data';
import { AlertState } from '../ManageBursts';

export interface MarketplaceCardComponentProps {
  burstMarketplaceOrder: BurstMarketplaceOrder;
  refetchResultsAsync: () => Promise<void>;
  setAlert: React.Dispatch<AlertState | React.SetStateAction<AlertState>>;
}

const SToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px;
`;

const SFavoriteButton = styled(IconButton)`
  &:hover {
    /* background-color:  */
    color: ${Colors.error};
  }
`;

const STableCell = styled(MuiTableCell)`
  color: rgba(0, 0, 0, 0.54);
`;

const SPanelActions = styled.div`
  display: flex;
  border-top: 2px solid;
  width: 100%;
  > button {
    width: 100%;
    border-radius: 0;
    font-weight: 700;
    &:not(:last-child) {
      border-right: solid 1px;
    }
  }
`;

const SBanner = styled.div`
  background-color: ${Colors.secondary.main};
  color: ${Colors.primary.main};
  font-size: 12px;
  padding: 6px;
  border-bottom-right-radius: 6px;
  position: absolute;
  top: 0;
  left: 0;
  a {
    color: ${Colors.primary.main};
    &:hover {
      text-decoration: none;
    }
  }
`;

const SMarketplaceButton = styled(Button)``;

const SStatusText = styled.div``;

const SInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 8px 16px 8px;
`;

const SPanelActionsContainer = styled.div`
  display: flex;
  /* position: absolute; */
`;

// should useQuery here for performance
const fetchBurstIsInMarketplaceAsync = async ({ burstTokenId, Moralis }: { burstTokenId: string; Moralis: any }): Promise<boolean> => {
  const result = await Moralis.Cloud.run('burstIsInMarketplace', { burstTokenId });
  return Array.isArray(result) ? !!result.length : result;
};

function MarketplaceCardComponent({ burstMarketplaceOrder, setAlert, refetchResultsAsync }: MarketplaceCardComponentProps) {
  const { numberFormatter } = useNumberFormatter();
  const queryClient = useQueryClient();
  const { web3, chainId, account } = useWallet();
  const { Moralis, isAuthenticated } = useMoralis();
  // don't retry fetching quotes if it fails on the first go
  const { data: ethPriceQuote } = useQuoteByTickers({ symbols: ['WETH'], options: { retry: false } });

  // data
  const chartData: BurstAssetChartDataItem[] = React.useMemo(() => {
    if (burstMarketplaceOrder.assets?.length) {
      return burstMarketplaceOrder.assets.map((asset) => {
        const { address, symbol, balance, decimals } = asset;
        const label = symbol || `${address.slice(0, 6)}...`;
        return {
          id: address,
          label,
          value: parseFloat(formatUnits(balance, decimals)),
        };
      });
    }
    return [];
  }, [burstMarketplaceOrder]);

  /**
   *
   */
  const totalUSDValue: string = React.useMemo(
    () =>
      !!ethPriceQuote?.allIds.length
        ? numberFormatter.format(parseFloat(burstMarketplaceOrder.price) * (ethPriceQuote.byId.WETH.quote || 0))
        : '$0.00',
    [numberFormatter, burstMarketplaceOrder, ethPriceQuote]
  );

  // internal state
  const [burstAssetsBreakdownDialogOpen, setBurstAssetsBreakdownDialogOpen] = React.useState(false);
  const [buyBurstDialogOpen, setBuyBurstDialogOpen] = React.useState(false);

  // handlers
  const handleClickFavoriteAsync = async () => {
    //
  };
  // console.log('MarketplaceOrder', burstMarketplaceOrder);

  const handleCloseBuyBurstDialog = () => setBuyBurstDialogOpen(false);
  const handleBuyMarketplaceOrderAsync = async () => {
    const marketplaceContract = createMarketplaceContract({ web3, chainId });
    const response = await marketplaceContract.methods
      .confirmMarketplaceOrder(parseInt(burstMarketplaceOrder.burstTokenId))
      .send({ from: account, value: parseUnits(burstMarketplaceOrder.price, 18) });
    handleCloseBuyBurstDialog();
    setAlert({
      msg: `BURST (#${burstMarketplaceOrder.burstTokenId}) was successfully purchased for ${burstMarketplaceOrder.price} ETH and is now in your account`,
    });
    return refetchResultsAsync();
  };

  const handleClickMoreDetails = () => setBurstAssetsBreakdownDialogOpen(true);
  const handleCloseBurstAssetsBreakdownDialog = () => setBurstAssetsBreakdownDialogOpen(false);
  return (
    <>
      <BuyBurstDialog
        open={buyBurstDialogOpen}
        onClose={handleCloseBuyBurstDialog}
        burstMarketplaceOrder={burstMarketplaceOrder}
        onClickConfirm={handleBuyMarketplaceOrderAsync}
        totalUSDValue={totalUSDValue}
      />
      <BurstAssetsBreakdownDialog
        open={burstAssetsBreakdownDialogOpen}
        onClose={handleCloseBurstAssetsBreakdownDialog}
        burstMarketplaceOrder={burstMarketplaceOrder}
      />

      <SBurstCard>
        {/* <SToolbar>
          <SFavoriteButton onClick={handleClickFavoriteAsync}>
            <FavoriteBorderIcon />
          </SFavoriteButton>
        </SToolbar> */}
        <SBurstCardContent onClick={handleClickMoreDetails}>
          <SChartTotalContainer>
            <BurstAssetChart data={chartData} height='150px' width='150px' />
          </SChartTotalContainer>
          <SInfo>
            <SStatusText>
              <strong>Assets: </strong>
              {burstMarketplaceOrder.assets.length}
            </SStatusText>
            <SStatusText>
              <strong>Sale Price: </strong>
              ETH {burstMarketplaceOrder.price} ≈ {totalUSDValue}
            </SStatusText>
          </SInfo>
        </SBurstCardContent>
        <SPanelActionsContainer>
          <SPanelActions>
            <SMarketplaceButton size='small' color='secondary' variant='contained' onClick={() => setBuyBurstDialogOpen(true)}>
              Buy
            </SMarketplaceButton>
          </SPanelActions>
        </SPanelActionsContainer>
      </SBurstCard>
    </>
  );
}

export const MarketplaceCard = React.memo(MarketplaceCardComponent);
