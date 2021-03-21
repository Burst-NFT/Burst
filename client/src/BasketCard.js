import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import IconButton from '@material-ui/core/IconButton';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

const StyledBasketCard = styled(MuiCard)`
  min-width: 500px;
  max-width: 700px;
`;

const CardActions = styled(MuiCardActions)`
  justify-content: center;
`;

function BasketCard({ basket, setBasket }) {
  const canCreateBasket = React.useMemo(() => !!(basket && Object.keys(basket).length), [basket]);
  const handleDeleteClickFn = (basketKey) => () => {
    setBasket((prev) => {
      const { [basketKey]: removed, ...remaining } = prev;
      return remaining;
    });
  };
  const handleCreateBurst = () => {};
  return (
    <StyledBasketCard>
      <CardHeader title='Basket' />
      <CardContent>
        <List dense={true}>
          {Object.keys(basket).map((k) => (
            <ListItem key={k}>
              <ListItemAvatar>
                <Avatar>
                  <MonetizationOnIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={basket[k].symbol ? `${basket[k].symbol}(${basket[k].address})` : basket[k].address}
                secondary={`Amount: ${basket[k].amount}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge='end' aria-label='delete' onClick={handleDeleteClickFn(k)}>
                  <DeleteOutlinedIcon style={{ color: red[500] }} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button color='primary' size='large' variant='outlined' onClick={handleCreateBurst} disabled={!canCreateBasket}>
          Create BURST
        </Button>
      </CardActions>
    </StyledBasketCard>
  );
}

export default BasketCard;
