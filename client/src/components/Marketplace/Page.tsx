import { InputLabel } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import { Color } from '@material-ui/lab/Alert';
import React from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import styled from 'styled-components';
import { BurstMarketplaceOrder } from '.';
import { MoralisBurstMarketplaceOrderRecord, MoralisParseObject, tables } from '../../data/moralis';
import { useDebounce } from '../../utils/debounce';
import Alert from '../Alert';
import { AlertState } from '../ManageBursts';
import { SPanelsContainer } from '../ManageBursts/styles';
import { Colors, SLayout } from '../styles';
import { useWallet } from '../Wallet';
import { MarketplaceCard } from './MarketplaceCard';
import { SearchCategoryButton } from './SearchCategoryButton';

const DEBOUNCE_DELAY = 300;

const SSearchFormWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SSearchFieldContainer = styled.div`
  border: 2px solid black;
  width: 100%;
  display: flex;
  border-radius: 4px;
`;
const SSearchFiltersContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
const SSearchForm = styled.form`
  width: 100%;
  max-width: 700px;
  padding: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

const SInputBase = styled(InputBase)`
  width: 100%;
  padding-left: 16px;
`;

const SInlineError = styled.div`
  font-style: italic;
  color: ${Colors.error};
  font-size: 12px;
`;

const searchFilters = ['My favorites'];
const searchCategoryOptions = {
  name: 'Name/Symbol',
  address: 'Address',
};

const initialSearchFiltersState = searchFilters.reduce<{ [filterName: string]: boolean }>((acc, cur) => {
  acc[cur] = false;
  return acc;
}, {});

// should useQuery here for performance
// const fetchSearchResultsAsync = async ({ searchInput, Moralis }: { searchInput: string; Moralis: any }): Promise<boolean> => {
//   const result = await Moralis.Cloud.run('burstIsInMarketplace', { burstTokenId });
//   return Array.isArray(result) ? !!result.length : result;
// };

function PageComponent() {
  const { web3 } = useWallet();
  const { Moralis, isAuthenticated } = useMoralis();

  const [alert, setAlert] = React.useState<AlertState>({ msg: '', type: '' });
  const [searchFiltersState, setSearchFiltersState] = React.useState(initialSearchFiltersState);
  const [searchCategoryValue, setSearchCategoryValue] = React.useState('name');
  const [inlineError, setInlineError] = React.useState('');

  const [searchInput, setSearchInput] = React.useState('');
  const [searchInputResult, setSearchInputResult] = React.useState<string | undefined>(undefined);

  const _setSearchInputResult = useDebounce(setSearchInputResult, DEBOUNCE_DELAY);

  const [results, setResults] = React.useState<BurstMarketplaceOrder[]>([]);
  const [filteredResults, setFilteredResults] = React.useState<BurstMarketplaceOrder[]>([]);

  const handleChangeSearch = React.useCallback(
    (e: any) => {
      setInlineError('');
      setSearchInput(e.target.value);
      _setSearchInputResult(e.target.value);
    },
    [setSearchInput, _setSearchInputResult, setInlineError]
  );

  const handleSetSearchCategoryValue = React.useCallback(
    (value: string) => {
      setInlineError('');
      setSearchInput('');
      _setSearchInputResult('');
      setSearchCategoryValue(value);
    },
    [setInlineError, setSearchCategoryValue, setSearchInput, _setSearchInputResult]
  );

  const handleChangeSearchFilter = React.useCallback(
    (e: any) => {
      setSearchFiltersState((prevState) => ({ ...prevState, [e.target.name]: e.target.checked }));
    },
    [setSearchFiltersState]
  );

  const isValidSearch = React.useCallback(
    (searchInput: string) => {
      // check address
      if (searchCategoryValue === 'address' && !web3.utils.isAddress(searchInput)) {
        setInlineError(`Address is invalid`);
        return false;
      }

      return true;
    },
    [searchCategoryValue]
  );

  const refetchResultsAsync = async () => {
    const _results = await Moralis.Cloud.run('searchMarketplaceOrderOnAssetMetadata', { searchInput: searchInputResult });
    // console.log('results', results);
    setResults(_results);
  };

  // only filter results
  React.useEffect(() => {
    if (!searchInputResult) return;
    setFilteredResults(results.filter((x) => !!x.assetMetadata && x.assetMetadata.toLowerCase().includes(searchInputResult.toLowerCase())));
  }, [searchInputResult, results]);

  //

  // initialize results
  React.useEffect(() => {
    if (!isAuthenticated || !Moralis) return;
    (async () => {
      if (!searchInputResult) {
        const _results = await Moralis.Cloud.run('searchMarketplaceOrderOnAssetMetadata', { searchInput: '' });
        console.log(_results);
        setResults(_results);
        setFilteredResults(_results);
        return;
      }
    })();
  }, [searchInputResult, isAuthenticated, Moralis]);

  const searchInputPlaceholder = searchCategoryValue === 'name' ? 'Search by asset name or symbol' : 'Search by address 0x000...';
  return (
    <SLayout maxWidth='1600px'>
      <Grid container xs={12} justify='center'>
        <Grid item xs={12}>
          <SSearchFormWrapper>
            <SSearchForm>
              <SSearchFieldContainer>
                <SearchCategoryButton
                  searchCategoryOptions={searchCategoryOptions}
                  searchCategoryValue={searchCategoryValue}
                  setSearchCategoryValue={handleSetSearchCategoryValue}
                />
                <SInputBase
                  value={searchInput}
                  onChange={handleChangeSearch}
                  placeholder={searchInputPlaceholder}
                  inputProps={{ 'aria-label': 'search assets' }}
                />
                <IconButton type='submit' aria-label='search'>
                  <SearchTwoToneIcon />
                </IconButton>
              </SSearchFieldContainer>
              {inlineError && <SInlineError>{inlineError}</SInlineError>}
              <SSearchFiltersContainer>
                {searchFilters.map((name) => (
                  <FormControlLabel
                    control={<Checkbox checked={searchFiltersState[name]} onChange={handleChangeSearchFilter} name={name} color='primary' />}
                    label={name}
                  />
                ))}
              </SSearchFiltersContainer>
            </SSearchForm>
          </SSearchFormWrapper>
        </Grid>
        <Grid item xs={12}>
          <SPanelsContainer>
            {!!filteredResults?.length &&
              filteredResults.map((item: BurstMarketplaceOrder, idx) => (
                <MarketplaceCard
                  burstMarketplaceOrder={item}
                  key={`${item.burstTokenId}_${idx}`}
                  refetchResultsAsync={refetchResultsAsync}
                  setAlert={setAlert}
                />
              ))}
          </SPanelsContainer>
        </Grid>
      </Grid>
      <Alert text={alert.msg} open={!!alert.msg} severity={alert.type as Color} destroyAlert={() => setAlert({ msg: '', type: '' })} />
    </SLayout>
  );
}

export const Page = PageComponent;
