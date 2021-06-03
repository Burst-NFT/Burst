import { BigNumber } from '@ethersproject/bignumber';
import { Erc20Info } from '../../api/getErc20InfoAsync';
import { AccountToken } from '../../queries/useAccountTokens';
import { BasketItem } from './types';

export function mapErc20InfoToAccountToken(erc20Info: Erc20Info): AccountToken {
  return {
    id: erc20Info.address,
    address: erc20Info.address,
    name: erc20Info.name,
    symbol: erc20Info.symbol,
    decimals: erc20Info.decimals,
    balance: erc20Info.balance,
  };
}

export function mapAccountTokenToBasketItem({
  contract,
  token,
  inputAmount,
}: {
  contract: any;
  token: AccountToken;
  inputAmount: string;
}): BasketItem {
  const amount = parseFloat(inputAmount);
  return {
    logoUrl: token.logoUrl,
    name: token.name || token.address,
    symbol: token.symbol || `${token.address.slice(0, 8)}...`,
    amount,
    decimals: token.decimals,
    address: token.address,
    contract,
  };
}
