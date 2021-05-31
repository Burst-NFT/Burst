import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TokenName } from '../TokenName';
import { useAccountTokens } from '../queries';
import { TokenBalance } from '../../api/fetchAccountTokens';
import CircularProgress from '@material-ui/core/CircularProgress';

interface TokenComboBoxProps {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<{}>, newValue: TokenBalance | string | null | undefined, reason: string) => void;
  onInputChange: (e: React.ChangeEvent<{}>, newInputValue: string) => void;
}

export function TokenComboBox({ value, onChange: handleChange, onInputChange: handleInputChange }: TokenComboBoxProps) {
  const { isLoading, error, data: tokens } = useAccountTokens();
  const [options, setOptions] = React.useState<TokenBalance[]>([]);
  React.useEffect(() => {
    if (!tokens) return undefined;
    const tokensArr = tokens.cryptoIds.map((id) => tokens.byId.get(id));
    setOptions(tokensArr as TokenBalance[]);
  }, [tokens]);
  return (
    <Autocomplete
      id='token-combo-box'
      autoHighlight
      freeSolo
      value={value}
      loading={isLoading}
      options={options}
      // @ts-ignore option can't be undefined
      getOptionLabel={(option) => (typeof option === 'string' ? option : option?.contract_ticker_symbol)}
      // style={{ width: 300 }}
      // @ts-ignore option can't be undefined
      renderOption={(option) => option && <TokenName symbol={option.contract_ticker_symbol} logo={option.logo_url} />}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          label='Token'
          placeholder='0x000...'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      onChange={handleChange}
      onInputChange={handleInputChange}
    />
  );
}
// <TokenName symbol={tokens.byId[id].contract_ticker_symbol} logo={tokens.byId[id].logo_url} />
