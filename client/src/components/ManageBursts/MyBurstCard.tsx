import React from 'react';
import styled from 'styled-components';

import MuiTableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';

import { useQuotes } from '../../queries';
import useNumberFormatter from '../useNumberFormatter';
import { TokenName } from '../TokenName';
import { Title } from './Title';
import { useWallet } from '../Wallet';
import { SendBurstDialog } from './SendBurstDialog';
import { DestroyBurstDialog } from './DestroyBurstDialog';
import { AlertState } from '.';
import { Burst } from '../Burst';
import { formatUnits } from '@ethersproject/units';
import { getBurstAssetsTotalValue } from './utils';
import { useQueryClient } from 'react-query';
import { createBurstContract, createMarketplaceContract } from '../../utils';
import { SellBurstDialog } from './SellBurstDialog';
import { SBurstCard, SBurstCardContent, SBurstCardToolbar, SChartTotalContainer, SMarker, SPanel } from './styles';
import { BurstAssetChart, BurstAssetChartDataItem } from '../BurstAssetChart';
import { Colors } from '../styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import { BurstAssetsBreakdownDialog } from './BurstAssetsBreakdownDialog';
import { useMoralis, useMoralisCloudFunction } from 'react-moralis';
import { CancelMarketplaceOrderDialog } from './CancelMarketplaceOrderDialog';

export interface BurstNftPanelProps {
  isInMarketplace?: boolean;
  burst: Burst;
  setAlert: React.Dispatch<AlertState | React.SetStateAction<AlertState>>;
}

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

function MyBurstCardComponent({ burst, setAlert }: BurstNftPanelProps) {
  const { numberFormatter } = useNumberFormatter();
  const queryClient = useQueryClient();
  const { web3, chainId, account } = useWallet();
  const { Moralis, isAuthenticated } = useMoralis();
  // don't retry fetching quotes if it fails on the first go
  const { data: priceQuotes } = useQuotes({ addresses: burst.assets.allIds, options: { retry: false } });
  const [isInMarketplace, setIsInMarketplace] = React.useState(false);

  const chartData: BurstAssetChartDataItem[] = React.useMemo(() => {
    if (burst?.assets?.allIds.length) {
      return burst.assets.allIds.map((id) => {
        const { address, symbol, balance, decimals } = burst.assets.byId[id];
        const label = symbol || `${address.slice(0, 6)}...`;
        return {
          id: address,
          label,
          value: parseFloat(formatUnits(balance, decimals)),
        };
      });
    }
    return [];
  }, [burst]);

  /**
   *
   */
  const totalBurstAssetValue: string = React.useMemo(
    () =>
      !!priceQuotes?.allIds.length
        ? numberFormatter.format(getBurstAssetsTotalValue({ priceQuotesById: priceQuotes.byId, burstAssets: burst.assets }))
        : '$0.00',
    [numberFormatter, priceQuotes, burst]
  );

  const [sendDialogOpen, setSendDialogOpen] = React.useState(false);
  const [sendDialogAddressValue, setSendDialogAddressValue] = React.useState('');
  const [destroyDialogOpen, setDestroyDialogOpen] = React.useState(false);
  const [sellDialogOpen, setSellDialogOpen] = React.useState(false);
  const [burstAssetsBreakdownDialogOpen, setBurstAssetsBreakdownDialogOpen] = React.useState(false);
  const [cancelMarketplaceOrderDialogOpen, setCancelMarketplaceOrderDialogOpen] = React.useState(false);

  // handlers
  const handleOnClickSendAsync = async () => {
    const burstContract = createBurstContract({ web3, chainId });
    const response = await burstContract.methods.transferFrom(account, sendDialogAddressValue, burst.id).send({ from: account });
    // console.log('handleOnClickSendAsync', response);
    setAlert({ msg: `BURST (#${burst.id}) successfully sent to '${sendDialogAddressValue}'` });
    await queryClient.refetchQueries(['bursts']);
    handleCloseSendDialog();
  };
  const handleCloseSendDialog = () => {
    setSendDialogOpen(false);
    setSendDialogAddressValue('');
  };

  const handleCloseDestroyDialog = () => setDestroyDialogOpen(false);
  const handleOnClickDestroyAsync = async () => {
    const burstContract = createBurstContract({ web3, chainId });
    const response = await burstContract.methods.destroyBurst(burst.id).send({ from: account });
    // console.log('handleOnClickDestroyAsync', response);
    setAlert({ msg: `BURST (#${burst.id}) successfully destroyed` });
    return queryClient.refetchQueries(['bursts']);
  };

  const handleClickSell = () => setSellDialogOpen(true);
  const handleCloseSellBurstDialogAsynv = async () => {
    setSellDialogOpen(false);
    // const result = await fetchBurstIsInMarketplaceAsync({ burstTokenId: burst.id, Moralis });
    setIsInMarketplace(true);
  };

  const handleClickMoreDetails = () => setBurstAssetsBreakdownDialogOpen(true);
  const handleCloseBurstAssetsBreakdownDialog = () => setBurstAssetsBreakdownDialogOpen(false);

  const handleCloseCancelMarketplaceOrderDialog = () => setCancelMarketplaceOrderDialogOpen(false);
  const handleConfirmCancelMarketplaceOrderDialogAsync = async () => {
    const marketplaceContract = createMarketplaceContract({ web3, chainId });
    const response = await marketplaceContract.methods.cancelMarketplaceOrder(burst.id).send({ from: account });
    setCancelMarketplaceOrderDialogOpen(false);

    // const result = await fetchBurstIsInMarketplaceAsync({ burstTokenId: burst.id, Moralis });
    setIsInMarketplace(false);
    setAlert({ msg: `BURST (#${burst.id}) removed from marketplace` });
  };

  const sendDialogProps = {
    sendDialogAddressValue,
    setSendDialogAddressValue,
    handleOnClickSend: handleOnClickSendAsync,
    handleClose: handleCloseSendDialog,
    open: sendDialogOpen,
  };

  // call cloud function now since we need to manually trigger it later
  React.useEffect(() => {
    if (!isAuthenticated || !Moralis) return;
    (async () => {
      const result = await fetchBurstIsInMarketplaceAsync({ burstTokenId: burst.id, Moralis });
      setIsInMarketplace(result);
    })();
  }, []);

  return (
    <>
      <SendBurstDialog {...sendDialogProps} />
      <DestroyBurstDialog open={destroyDialogOpen} onClickClose={handleCloseDestroyDialog} onClickConfirm={handleOnClickDestroyAsync} />
      <SellBurstDialog open={sellDialogOpen} onClose={handleCloseSellBurstDialogAsynv} burst={burst} />
      <BurstAssetsBreakdownDialog open={burstAssetsBreakdownDialogOpen} onClose={handleCloseBurstAssetsBreakdownDialog} burst={burst} />
      <CancelMarketplaceOrderDialog
        open={cancelMarketplaceOrderDialogOpen}
        onClickClose={handleCloseCancelMarketplaceOrderDialog}
        onClickConfirm={handleConfirmCancelMarketplaceOrderDialogAsync}
      />
      <SBurstCard>
        {!!isInMarketplace && (
          <SBanner>
            <RouterLink to={`/marketplace`}>Marketplace</RouterLink>
          </SBanner>
        )}
        <SBurstCardContent onClick={handleClickMoreDetails}>
          <SChartTotalContainer>
            <BurstAssetChart data={chartData} height='150px' width='150px' />
          </SChartTotalContainer>
          <SInfo>
            <SStatusText>
              <strong>Assets: </strong>
              {burst.assets.allIds.length}
            </SStatusText>
            <SStatusText>
              <strong>Estimated Value: </strong>
              {totalBurstAssetValue}
            </SStatusText>
          </SInfo>
        </SBurstCardContent>
        <SPanelActionsContainer>
          <SPanelActions>
            {!!isInMarketplace ? (
              <>
                <SMarketplaceButton size='small' color='secondary' variant='contained' onClick={handleClickSell}>
                  Change
                </SMarketplaceButton>
                <SMarketplaceButton size='small' color='secondary' variant='contained' onClick={() => setCancelMarketplaceOrderDialogOpen(true)}>
                  Cancel
                </SMarketplaceButton>
              </>
            ) : (
              <>
                <Button size='small' color='primary' variant='contained' onClick={handleClickSell}>
                  Sell
                </Button>
                <Button size='small' color='primary' variant='contained' onClick={() => setDestroyDialogOpen(true)}>
                  Destory
                </Button>
                <Button size='small' color='primary' variant='contained' onClick={() => setSendDialogOpen(true)}>
                  Send
                </Button>
              </>
            )}
          </SPanelActions>
        </SPanelActionsContainer>
      </SBurstCard>
    </>
  );
}

export const MyBurstCard = React.memo(MyBurstCardComponent);
