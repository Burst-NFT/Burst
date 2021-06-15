import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import MuiTableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select, { SelectProps } from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { MaxUint256 } from '@ethersproject/constants';
import produce from 'immer';

import CardHeader from '../CardHeader';
import { useWallet } from '../Wallet';
import { abi as ERC20ABI } from '../../contracts/ERC20.json';
import useNumberFormatter from '../useNumberFormatter';
import { TokenName } from '../TokenName';
import { createBurstMetadataAsync, getErc20InfoAsync } from '../../api';
import { CreateSuccessDialog, SuccessDialogData } from './CreateSuccessDialog';
import { useAccountTokens, useQuotes } from '../../queries';
import { AvailableBalance } from './AvailableBalance';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import { TokenComboBox } from './TokenComboBox';
import Alert from '../Alert';
import { AccountToken } from '../../queries/useAccountTokens';
import { mapAccountTokenToBasketItem, mapErc20InfoToAccountToken } from './utils';
import { BasketState } from './types';
import { parseUnits } from '@ethersproject/units';
import { BigNumberish } from '@ethersproject/bignumber';
import { createBurstContract, getBurstAddress } from '../../utils';
import { useQueryClient } from 'react-query';
import { useMoralis, useNewMoralisObject } from 'react-moralis';
import { MoralisBurstAssetRecord, mapApiBurstMetadataAsset, tables } from '../../data/moralis';
import { ApiBurstMetadataAsset } from '../Burst';
import { Colors } from '../styles';
import { BurstAssetChart, BurstAssetChartDataItem } from '../BurstAssetChart';

const SFormActions = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
`;

const SForm = styled.form`
  margin-top: 24px;
`;
const SFields = styled.div`
  display: flex;
  flex-direction: row;
`;

const SAddButton = styled(Button)`
  && {
    font-weight: 600;
  }
`;

const SRemoveIconButton = styled(IconButton)`
  color: ${Colors.error};
`;

const initialBasketState: BasketState = { byId: {}, allIds: [] };

const STableContainer = styled(MuiTableContainer)`
  margin-top: 16px;
`;
const SDisplayBreakdown = styled.div`
  display: flex;
  > div:not(:last-child) {
    margin-right: 16px;
  }
`;

const initialDialogData = {
  basket: { ...initialBasketState },
  result: undefined,
};

export function CreateBurstForm() {
  const queryClient = useQueryClient();
  // Setup
  const { Moralis } = useMoralis();
  const { save } = useNewMoralisObject(tables.burstAsset);

  const { web3, account, network, chainId } = useWallet();
  const { isLoading, error: useAccountTokensError, data: accountTokens } = useAccountTokens();

  const { numberFormatter } = useNumberFormatter();
  const burstAddress = React.useMemo(() => getBurstAddress({ chainId }), [chainId]);

  // Internal state
  const [basket, setBasket] = React.useState<BasketState>(initialBasketState);
  const { data: priceQuotes } = useQuotes({ addresses: basket.allIds });
  const [selectedAddress, setSelectedAddress] = React.useState('');
  const [amount, setAmount] = React.useState<string>('');
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);
  const [successDialogData, setSuccessDialogData] = React.useState<SuccessDialogData>({ ...initialDialogData });
  const [validationErrorMsg, setValidationErrorMsg] = React.useState('');

  const chartData: BurstAssetChartDataItem[] = React.useMemo(() => {
    if (basket?.allIds.length) {
      return basket.allIds.map((id) => ({
        id: basket.byId[id].address,
        label: basket.byId[id].symbol || `${basket.byId[id].address.slice(0, 6)}...`,
        value: basket.byId[id].amount,
      }));
    }
    return [];
  }, [basket]);

  const handleAddClick = React.useCallback(async () => {
    if (!web3.utils.isAddress(selectedAddress)) {
      setValidationErrorMsg(`Token address '${selectedAddress}' is invalid`);
      return;
    }

    // attempt to create a contract, will error if invalid
    const contract = new web3.eth.Contract(ERC20ABI, selectedAddress);

    // Get token from list of tokens associated with account, or if not found then attempt to retrieve the token data
    let token = {} as AccountToken;

    try {
      token = accountTokens?.byId[selectedAddress] || mapErc20InfoToAccountToken(await getErc20InfoAsync({ contract, account }));
    } catch (err) {
      setValidationErrorMsg(`Unable to read '${selectedAddress}'.  Please try again.`);
      return;
    }

    setBasket(
      produce((draft) => {
        draft.byId[selectedAddress] = mapAccountTokenToBasketItem({ contract, token, inputAmount: amount });
        draft.allIds = Object.keys(draft.byId);
      })
    );
    // reset
    setSelectedAddress('');
    setAmount('');
  }, [accountTokens, amount, selectedAddress, web3, numberFormatter]);

  const handleRemoveFromBasketFn = (id: string) => () => {
    setBasket((prevState) => {
      const { [id]: ___, ...remainingState } = prevState.byId;
      return { byId: remainingState, allIds: Object.keys(remainingState) };
    });
  };

  const handleOnChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleTokenComboBoxOnChange = (e: React.ChangeEvent<{}>, newValue: AccountToken | string | null | undefined, reason: string) => {
    if (reason === 'select-option') {
      setSelectedAddress((newValue as AccountToken).address);
    } else if (reason === 'create-option') {
      setSelectedAddress(newValue as string);
    } else {
      setSelectedAddress('');
    }
    setValidationErrorMsg('');
    setAmount('');
  };

  const handleTokenComboBoxInputOnChange = (e: React.ChangeEvent<{}>, newInputValue: string) => {
    setSelectedAddress(newInputValue);
    setValidationErrorMsg('');
  };

  const handleCreateBurstAsync = async () => {
    // web3.currentProvider.enable();
    const { chainId } = network;
    const contract = createBurstContract({ web3, chainId });

    // approve transactions, Promise.all seems to make metamask hang a bit, especially for long running transactions
    // TODO: Batch request
    for (let i = 0; i < basket.allIds.length; i++) {
      const id = basket.allIds[i];
      await basket.byId[id].contract.methods.approve(burstAddress, MaxUint256).send({ from: account });
    }

    const balances: BigNumberish[] = [];
    const metadataAssets: ApiBurstMetadataAsset[] = [];

    for (let i = 0; i < basket.allIds.length; i++) {
      const id = basket.allIds[i];
      const balance = parseUnits(`${basket.byId[id].amount}`, basket.byId[id].decimals);

      metadataAssets.push({
        token_address: id,
        token_name: basket.byId[id].name,
        token_symbol: basket.byId[id].symbol,
        token_balance: balance.toString(),
        token_decimals: basket.byId[id].decimals,
        token_logo_url: basket.byId[id].logoUrl,
      });

      balances.push(balance);
    }

    const ipfsHash = await createBurstMetadataAsync(Moralis, metadataAssets);

    // create burst
    const result = await contract.methods.createBurst(basket.allIds, balances, ipfsHash).send({ from: account });

    // TODO: replace with cloud function?
    const burstTokenId = result.events.BurstCreated.returnValues.tokenId;
    const saveTasks: Promise<MoralisBurstAssetRecord>[] = metadataAssets.map((t) => save(mapApiBurstMetadataAsset({ burstTokenId, tokenAsset: t })));
    await Promise.all(saveTasks);

    setSuccessDialogData({ basket: { ...basket }, result });
    setSuccessDialogOpen(true);

    // reset everything
    await queryClient.refetchQueries(['bursts']);
    setSelectedAddress('');
    setAmount('');
    setBasket({ ...initialBasketState });
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    setSuccessDialogData({ ...initialDialogData });
  };

  const onErrorAlertDestory = React.useCallback(() => {
    setValidationErrorMsg('');
  }, [setValidationErrorMsg]);

  // const onErrorAccountTokensAlertDestory = React.useCallback(() => {
  //   setShowAccountTokensError(false);
  // }, [setShowAccountTokensError]);

  return (
    <>
      {/* <Alert
        severity='error'
        open={!!(showAccountTokensError && useAccountTokensError)}
        text='An error occured. Please reload the page and try again.'
        destroyAlert={onErrorAccountTokensAlertDestory}
      /> */}
      <Alert severity='error' open={!!validationErrorMsg} text={validationErrorMsg} destroyAlert={onErrorAlertDestory} />
      <CreateSuccessDialog data={successDialogData} open={successDialogOpen} handleClose={handleCloseSuccessDialog} />

      <SForm>
        <SFields style={{ marginBottom: '16px', flexDirection: 'column' }}>
          <AvailableBalance address={selectedAddress} />
          <FormControl variant='outlined' style={{ width: '100%' }}>
            <TokenComboBox
              value={accountTokens?.byId[selectedAddress]?.symbol || selectedAddress}
              onChange={handleTokenComboBoxOnChange}
              onInputChange={handleTokenComboBoxInputOnChange}
            />
          </FormControl>
        </SFields>
        <SFields>
          <TextField
            style={{ width: '100%', paddingRight: '16px' }}
            variant='outlined'
            id='add-amount-input'
            label='Amount'
            type='number'
            placeholder='0.0'
            onChange={handleOnChangeAmount}
            value={amount}
            disabled={!amount && !selectedAddress}
          />
          <SAddButton variant='outlined' onClick={handleAddClick} disabled={!amount || !selectedAddress}>
            Add
          </SAddButton>
        </SFields>

        {!!basket.allIds.length && (
          <SDisplayBreakdown>
            {chartData && <BurstAssetChart data={chartData} height='300px' width='300px' />}
            <STableContainer>
              <Table size='small' aria-label='a dense table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell align='right'>Amount</TableCell>
                    {/* <TableCell align="right">Allocation (%)</TableCell> */}
                    <TableCell align='right'>Est. Value ($)</TableCell>
                    <TableCell align='right'></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {basket.allIds.map((id) => {
                    const { symbol, address, logoUrl, amount } = basket.byId[id];
                    const totalValue = amount * (priceQuotes?.byId[address]?.quote || 0);
                    return (
                      <TableRow key={id}>
                        <TableCell align='left'>
                          <TokenName symbol={symbol} address={address} logo={logoUrl} />
                        </TableCell>
                        <TableCell align='right'>{amount}</TableCell>
                        <TableCell align='right'>{numberFormatter.format(totalValue)}</TableCell>
                        <TableCell align='right'>
                          <SRemoveIconButton color='primary' aria-label='remove token' onClick={handleRemoveFromBasketFn(id)}>
                            <RemoveCircleOutlineIcon />
                          </SRemoveIconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell rowSpan={3} />
                    <TableCell align='right'>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align='right'>
                      <strong>
                        {numberFormatter.format(
                          basket.allIds.reduce((sum, addr) => sum + basket.byId[addr].amount * (priceQuotes?.byId[addr]?.quote || 0), 0)
                        )}
                      </strong>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </STableContainer>
          </SDisplayBreakdown>
        )}
        <SFormActions>
          <Button color='primary' size='large' variant='contained' onClick={handleCreateBurstAsync} disabled={!basket.allIds.length}>
            Create BURST
          </Button>
        </SFormActions>
      </SForm>
    </>
  );
}
