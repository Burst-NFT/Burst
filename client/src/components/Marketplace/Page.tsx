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
import React from 'react';
import { useMoralisQuery } from 'react-moralis';
import styled from 'styled-components';
import { tables } from '../../data/moralis';
import { useDebounce } from '../../utils/debounce';
import { SLayout } from '../styles';
import { MarketplaceCard } from './MarketplaceCard';
import { SearchCategoryButton } from './SearchCategoryButton';

export interface MoralisMarketplaceOrderCreatedEventObjectAttributes {
  block_timestamp: any;
  transaction_hash: string;
  log_index: number;
  block_hash: string;
  block_number: number;
  transaction_index: number;
  createdAt: Date;
  updatedAt: Date;

  // custom event details
  maker: string;
  tokenId: string;
  price: string;
  paymentToken: string;
  address: string;
}

export interface MoralisParseObject<T> {
  className: string;
  id: string; // objectId

  attributes: T;
  createdAt: Date;
  updatedAt: Date;
}

const DEBOUNCE_DELAY = 500;

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

const searchFilters = ['My favorites'];
const searchCategoryOptions = {
  name: 'Name/Symbol',
  address: 'Address',
};

const initialSearchFiltersState = searchFilters.reduce<{ [filterName: string]: boolean }>((acc, cur) => {
  acc[cur] = false;
  return acc;
}, {});
function PageComponent() {
  const { data, error, isLoading } = useMoralisQuery<MoralisParseObject<MoralisMarketplaceOrderCreatedEventObjectAttributes>>(
    tables.marketplaceOrderCreatedEvents,
    (q) => q
  );
  const [searchFiltersState, setSearchFiltersState] = React.useState(initialSearchFiltersState);
  const [searchCategoryValue, setSearchCategoryValue] = React.useState('name');

  const [searchInput, setSearchInput] = React.useState('');
  const [searchInputResult, setSearchInputResult] = React.useState('');
  const _setSearchInputResult = useDebounce(setSearchInputResult, DEBOUNCE_DELAY);

  const handleChangeSearch = React.useCallback(
    (e: any) => {
      setSearchInput(e.target.value);
      _setSearchInputResult(e.target.value);
    },
    [setSearchInput, setSearchInputResult]
  );

  const handleChangeSearchFilter = React.useCallback(
    (e: any) => {
      setSearchFiltersState((prevState) => ({ ...prevState, [e.target.name]: e.target.checked }));
    },
    [setSearchFiltersState]
  );

  React.useEffect(() => {
    console.log(searchInputResult);
  }, [searchInputResult]);

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
                  setSearchCategoryValue={setSearchCategoryValue}
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
        <Grid item xs={12} justify='center'>
          {!!data?.length &&
            data.map((item: MoralisParseObject<MoralisMarketplaceOrderCreatedEventObjectAttributes>, idx) => (
              <Grid item xs={3} key={item.id}>
                <MarketplaceCard data={item} key={`${item.id}_${idx}`} />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </SLayout>
  );
}

export const Page = PageComponent;
