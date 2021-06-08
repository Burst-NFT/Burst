import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import MuiDialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MuiTableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useWallet } from '../Wallet';
import { useQueryClient } from 'react-query';
import { Burst } from '../Burst';
import { useQuotes } from '../../queries';
import InputAdornment from '@material-ui/core/InputAdornment';
import { formatUnits } from '@ethersproject/units';
import { TokenName } from '../TokenName';
import useNumberFormatter from '../useNumberFormatter';
import { getBurstAssetsTotalValue } from './utils';
import { Ether } from '../../data/tokenInfo';
import Divider from '@material-ui/core/Divider';
import { createBurstContract, createMarketplaceContract } from '../../utils';

export interface SellBurstDialogProps {
  open: boolean;
  onClose: () => void;
  burst: Burst;
}

const Dialog = styled(MuiDialog)``;

const DialogActions = styled(MuiDialogActions)`
  padding-top: 16px;
`;

const TableCell = styled(MuiTableCell)`
  color: rgba(0, 0, 0, 0.54);
`;

function SellBurstDialog({ open = false, onClose: handleClose, burst }: SellBurstDialogProps) {
  const queryClient = useQueryClient();
  const { numberFormatter } = useNumberFormatter();
  const { web3, chainId, account } = useWallet();
  const { isLoading, data: priceQuotes } = useQuotes({ addresses: burst.assets.allIds.concat(Ether.address as string), options: { retry: false } });

  const totalBurstAssetValue = React.useMemo(
    () => (!!priceQuotes?.allIds.length ? getBurstAssetsTotalValue({ priceQuotesById: priceQuotes.byId, burstAssets: burst.assets }) : 0),
    [priceQuotes, burst]
  );

  const [sellPrice, setSellPrice] = React.useState<number>(0);
  const handleClickConfirmAsync = async () => {
    const burstContract = createBurstContract({ web3, chainId });
    const marketplaceContract = createMarketplaceContract({ web3, chainId });

    await burstContract.methods.approve(marketplaceContract.options.address, parseInt(burst.id)).send({ from: account });
    const result = await marketplaceContract.methods.createMarketplaceOrder(parseInt(burst.id), Ether.address, sellPrice).send({ from: account });
    console.log(result);
    await queryClient.refetchQueries(['bursts']);
    handleClose();
  };

  const handleChangeSellPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellPrice(parseFloat(e.target.value));
  };

  const etherQuote = priceQuotes?.byId[Ether.address as string]?.quote;
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Sell Your Burst</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TableContainer style={{ margin: '16px' }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell align='right'>Amount</TableCell>
                <TableCell align='right'>Est. Value</TableCell>
                <TableCell align='right'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {burst.assets?.allIds.map((id) => {
                const { symbol, address, logoUrl, decimals, balance } = burst.assets.byId[id];
                const amount = parseFloat(formatUnits(balance, decimals));
                const totalValue = amount * (priceQuotes?.byId[address]?.quote || 0);
                return (
                  <TableRow key={id}>
                    <TableCell align='left'>
                      <TokenName symbol={symbol} address={address} logo={logoUrl} />
                    </TableCell>
                    <TableCell align='right'>{amount}</TableCell>
                    <TableCell align='right'>{totalValue ? numberFormatter.format(totalValue) : '-'}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell rowSpan={3} style={{ borderBottom: 'none' }} />
                <TableCell align='right'>
                  <strong>Total Estimated Value</strong>
                </TableCell>
                <TableCell align='right'>
                  <strong>
                    {numberFormatter.format(totalBurstAssetValue)} ≈ {etherQuote ? totalBurstAssetValue / etherQuote : 0} ETH{' '}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <TextField
          variant='outlined'
          id='add-sell-price-input'
          label='Price'
          type='number'
          placeholder='0.0'
          onChange={handleChangeSellPrice}
          value={sellPrice}
          InputProps={{
            startAdornment: <InputAdornment position='start'>ETH</InputAdornment>,
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClickConfirmAsync} color='secondary' disabled={sellPrice <= 0}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export { SellBurstDialog };
