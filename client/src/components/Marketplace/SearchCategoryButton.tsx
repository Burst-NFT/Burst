import React from 'react';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const SButton = styled(Button)`
  && {
    /* border: 2px solid black; */
    color: black;
    background: white;
    min-width: 150px;
  }
`;

const SMenuItemText = styled.span`
  /* padding-left: 8px; */
`;

interface SearchCategoryButtonComponentProps {
  searchCategoryValue: string;
  setSearchCategoryValue: (newState: string) => void;
  searchCategoryOptions: { [key: string]: string };
}

function SearchCategoryButtonComponent({ searchCategoryValue, setSearchCategoryValue, searchCategoryOptions }: SearchCategoryButtonComponentProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickToggleMenu = React.useCallback(
    (e: any) => {
      setAnchorEl(e.currentTarget);
    },
    [setAnchorEl]
  );
  const handleCloseMenu = React.useCallback(() => setAnchorEl(null), [setAnchorEl]);
  console.log('SearchCategoryButtonComponent');
  return (
    <>
      <SButton variant='contained' disableElevation endIcon={<ExpandMoreIcon />} onClick={handleClickToggleMenu}>
        {searchCategoryOptions[searchCategoryValue]}
      </SButton>
      <Menu
        id='search-category-menu'
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        keepMounted
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {Object.keys(searchCategoryOptions).map((catKey) => (
          <MenuItem
            key={catKey}
            onClick={() => {
              handleCloseMenu();
              setSearchCategoryValue(catKey);
            }}
          >
            <SMenuItemText>{searchCategoryOptions[catKey]}</SMenuItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export const SearchCategoryButton = React.memo(SearchCategoryButtonComponent);
