import React from 'react';
import styled from 'styled-components';
import MuiCard from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import MuiCardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import * as cryptoOptions from './cryptoOptions';

const StyledBasketCard = styled(MuiCard)`
  max-width: 700px;
`;

const CardActions = styled(MuiCardActions)`
  justify-content: flex-end;
`;

function BasketCard({ basket, setBasket }) {
  const handleDeleteClickFn = (basketKey) => () => {
    setBasket((prev) => {
      const { [basketKey]: removed, ...remaining } = prev;
      return remaining;
    });
  };
  const handleCreateBurst = () => {};
  return (
    <StyledBasketCard>
      <CardContent>
        <List dense={true}>
          {Object.keys(basket).map((k) => (
            <ListItem key={k}>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={cryptoOptions.byId[k].name}
                secondary={`$${basket[k].price} x ${basket[k].amount} = $${basket[k].price * basket[k].amount}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge='end' aria-label='delete' onClick={handleDeleteClickFn(k)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button color='primary' onClick={handleCreateBurst}>
          Create BURST
        </Button>
      </CardActions>
    </StyledBasketCard>
  );
}

export default BasketCard;
