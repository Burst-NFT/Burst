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
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import CardHeader from '@material-ui/core/CardHeader';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { formatUnits } from '@ethersproject/units';
import produce from 'immer';
import useTokenBalances from '../TokenBalance/useTokenBalances';
import useWallet from '../Wallet/useWallet';
import { abi as ERC20ABI } from '../../contracts/IERC20.json';
import ErrorAlert from '../ErrorAlert';
import { createBurstContract } from '../Burst/utils';
import { findTokenBySymbol } from '../utils';
import useNumberFormatter from '../useNumberFormatter';
import TokenName from '../TokenName';
import CreateSuccessDialog from './CreateSuccessDialog';

const StyledAddCard = styled(MuiCard)`
  max-width: 650px;
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
  > :not(:last-child) {
    padding-right: 16px;
  }
`;

const StyledAvailableBalance = styled.div`
  padding-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  && {
    padding-right: 0;
  }
`;
function AvailableBalance({ tokenAddress }) {
  const { data: tokens } = useTokenBalances();

  const token = tokens.byId[tokenAddress];
  const balance = React.useMemo(() => {
    const _balance = token?.balance;
    return _balance ? parseFloat(formatUnits(_balance, token.contract_decimals)).toPrecision(4) : 0;
  }, [token]);
  return (
    <StyledAvailableBalance>
      <Chip color='primary' label={`Available balance: ${balance}`} />
    </StyledAvailableBalance>
  );
}

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
  const { web3, account, network } = useWallet();
  const { isLoading, error, data: tokens } = useTokenBalances();
  const { numberFormatter } = useNumberFormatter();
  const burstToken = React.useMemo(() => findTokenBySymbol({ chainId: network?.chainId, symbol: 'BURST' }), [network]);

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
    const { logo_url: logo, contract_name: name, contract_ticker_symbol: symbol, quote_rate } = token;
    setBasket(
      produce((draft) => {
        draft.byId[selectedAddress] = {
          logo,
          name,
          symbol,
          amount,
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
      await basket.byId[id].contract.methods.approve(burstToken.address, basket.byId[id].amount).send({ from: account });
    }

    // create burst
    const amounts = basket.allIds.map((id) => basket.byId[id].amount);
    const result = await contract.methods.createBurstWithMultiErc20(basket.allIds, amounts).send({ from: account });

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
        <CardHeader />
        <CardContent>Loading...</CardContent>
      </StyledAddCard>
    );

  if (error) return <ErrorAlert text='An error occured. Please reload the page and try again.' />;

  return (
    <>
      <CreateSuccessDialog data={successDialogData} open={successDialogOpen} handleClose={handleCloseSuccessDialog} />
      <StyledAddCard>
        <CardHeader />
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
                style={{ width: '100%' }}
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
