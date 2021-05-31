import { BigNumber, BigNumberish } from '@ethersproject/bignumber';

export interface Erc20Info {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: BigNumberish;
}

export async function getErc20InfoAsync({ contract, account }: { contract: any; account: string }): Promise<Erc20Info> {
  let name = '';
  let symbol = '';
  let _decimals = '';
  let _balance = '0';
  [name, symbol, _decimals, _balance] = await Promise.all([
    contract.methods.name().call(),
    contract.methods.symbol().call(),
    contract.methods.decimals().call(),
    contract.methods.balanceOf(account).call(),
  ]);

  return {
    address: contract.options.address,
    name,
    symbol,
    decimals: parseInt(_decimals),
    balance: BigNumber.from(_balance),
  };
}
