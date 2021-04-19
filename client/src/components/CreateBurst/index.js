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
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { MaxUint256 } from '@ethersproject/constants';
import produce from 'immer';

import CardHeader from '../CardHeader';
import useWallet from '../Wallet/useWallet';
import { abi as ERC20ABI } from '../../contracts/IERC20.json';
import ErrorAlert from '../ErrorAlert';
import { createBurstContract, getBurstAddress } from '../Burst/utils';
import useNumberFormatter from '../useNumberFormatter';
import TokenName from '../TokenName';
import createBurstMetadataAsync from '../../api/createBurstMetadataAsync';
import CreateSuccessDialog from './CreateSuccessDialog';
import { useAccountTokens } from '../queries';
import AvailableBalance from './AvailableBalance';

const StyledAddCard = styled(MuiCard)`
  min-width: 450px;
  /* max-width: 650px; */
`;

const CardActions = styled(MuiCardActions)`
  justify-content: center;
  margin-bottom: 16px;
  button {
    border-radius: 30px;
  }
`;

const Form = styled.form``;
const Fields = styled.div`
  display: flex;
  flex-direction: row;
`;

const initialBasketState = { byId: {}, allIds: [] };

const TableContainer = styled(MuiTableContainer)`
  margin-top: 16px;
`;

const initialDialogData = {
  basket: { ...initialBasketState },
  result: undefined,
};

function CreateBurst() {
  // Setup
  const { web3, account, network, chainId } = useWallet();
  const { isLoading, error, data: tokens } = useAccountTokens();
  const { numberFormatter } = useNumberFormatter();
  const burstAddress = React.useMemo(() => getBurstAddress({ chainId }), [chainId]);

  // Internal state
  const [basket, setBasket] = React.useState(initialBasketState);
  const [selectedAddress, setSelectedAddress] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [successDialogOpen, setSuccessDialogOpen] = React.useState(false);
  const [successDialogData, setSuccessDialogData] = React.useState({ ...initialDialogData });

  const handleAddClick = React.useCallback(() => {
    const token = tokens.byId[selectedAddress];
    // attempt to create a contract, will error if invalid
    const contract = new web3.eth.Contract(ERC20ABI, selectedAddress);
    // map covalent response to friendly field names
    const { logo_url: logo, contract_name: name, contract_ticker_symbol: symbol, quote_rate, contract_decimals: decimals } = token;
    setBasket(
      produce((draft) => {
        draft.byId[selectedAddress] = {
          logo,
          name,
          symbol,
          amount,
          decimals,
          address: selectedAddress,
          total: quote_rate * amount,
          contract,
        };
        draft.allIds = Object.keys(draft.byId);
      })
    );
    // reset
    setSelectedAddress('');
    setAmount(0);
  }, [tokens, amount, selectedAddress, web3, numberFormatter]);

  const handleRemoveFromBasketFn = (id) => () => {
    setBasket((prevState) => {
      const { [id]: ___, ...remainingState } = prevState.byId;
      return { byId: remainingState, allIds: Object.keys(remainingState) };
    });
  };

  const handleOnChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleSelectTokenOnChange = (e) => {
    const address = e.target.value;
    setSelectedAddress(address);
    setAmount(0);
  };

  const handleCreateBurstAsync = async () => {
    const { chainId } = network;
    const contract = createBurstContract({ web3, chainId });

    // approve transactions, 1 by 1, Promise all seems to make metamask hang a bit, especially for long running transactions
    for (let i = 0; i < basket.allIds.length; i++) {
      const id = basket.allIds[i];
      await basket.byId[id].contract.methods.approve(burstAddress, MaxUint256).send({ from: account });
    }

    // create required fields to create burst
    const amounts = basket.allIds.map((id) => Math.floor(basket.byId[id].amount * 10 ** basket.byId[id].decimals).toFixed());

    // console.log(basket.byId[id].amount * (10**(basket.byId[id].decimals)).toFixed());
    // return (new BN(basket.byId[id].amount * (10**(basket.byId[id].decimals))).toString());
    //   return ;
    //   // return basket.byId[id].amount;
    // });
    const metadataAssets = basket.allIds.map((id) => ({
      token_address: id,
      token_name: basket.byId[id].name,
      token_symbol: basket.byId[id].symbol,
      token_amount: basket.byId[id].amount * 10 ** basket.byId[id].decimals,
    }));
    const ipfsHash = await createBurstMetadataAsync(metadataAssets);

    // create burst
    const result = await contract.methods.createBurstWithMultiErc20(basket.allIds, amounts, ipfsHash).send({ from: account });

    setSuccessDialogData({ basket: { ...basket }, result });
    setSuccessDialogOpen(true);

    // reset everything
    setSelectedAddress('');
    setAmount(0);
    setBasket({ ...initialBasketState });
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
    setSuccessDialogData({ ...initialDialogData });
  };

  if (isLoading)
    return (
      <StyledAddCard>
        <CardHeader title='Create' />
        <CardContent>Loading...</CardContent>
      </StyledAddCard>
    );

  if (error) return <ErrorAlert text='An error occured. Please reload the page and try again.' />;

  return (
    <>
      <CreateSuccessDialog data={successDialogData} open={successDialogOpen} handleClose={handleCloseSuccessDialog} />
      <StyledAddCard>
        <CardHeader title='Create' />
        <Form>
          <CardContent>
            <Fields style={{ marginBottom: '16px', flexDirection: 'column' }}>
              <AvailableBalance tokenAddress={selectedAddress} />
              <FormControl variant='outlined' style={{ width: '100%' }}>
                <InputLabel htmlFor='select-token'>Token</InputLabel>
                <Select
                  value={selectedAddress}
                  onChange={handleSelectTokenOnChange}
                  label='Token'
                  inputProps={{
                    name: 'token',
                    id: 'select-token',
                  }}
                >
                  <MenuItem value=''>
                    <em>None</em>
                  </MenuItem>
                  {tokens.cryptoIds.map((id) => (
                    <MenuItem key={id} value={id}>
                      <TokenName symbol={tokens.byId[id].contract_ticker_symbol} logo={tokens.byId[id].logo_url} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Fields>
            <Fields>
              <TextField
                style={{ width: '100%', paddingRight: '16px' }}
                variant='outlined'
                id='add-amount-input'
                label='Amount'
                type='number'
                onChange={handleOnChangeAmount}
                value={amount}
                disabled={!amount && !selectedAddress}
              />
              <Button variant='outlined' onClick={handleAddClick} style={{ maxHeight: '56px' }} disabled={!amount || !selectedAddress}>
                Add
              </Button>
            </Fields>

            {!!basket.allIds.length && (
              <TableContainer>
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
                    {basket.allIds.map((id) => (
                      <TableRow key={id}>
                        <TableCell align='left'>
                          <TokenName symbol={basket.byId[id].symbol} logo={basket.byId[id].logo} />
                        </TableCell>
                        <TableCell align='right'>{basket.byId[id].amount}</TableCell>
                        <TableCell align='right'>{numberFormatter.format(basket.byId[id].total)}</TableCell>
                        <TableCell align='right'>
                          <IconButton color='secondary' aria-label='remove token' onClick={handleRemoveFromBasketFn(id)}>
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell rowSpan={3} />
                      <TableCell align='right'>
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell align='right'>
                        <strong>{numberFormatter.format(basket.allIds.reduce((sum, id) => sum + basket.byId[id].total, 0))}</strong>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
          <CardActions>
            <Button color='primary' size='large' variant='contained' onClick={handleCreateBurstAsync} disabled={!basket.allIds.length}>
              Create BURST
            </Button>
          </CardActions>
        </Form>
      </StyledAddCard>
    </>
  );
}

export default CreateBurst;
