import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { getDecimalsOrDefaultAsync } from '../utils/getDecimalsOrDefaultAsync';

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
  let decimals = 18;
  let _balance = '0';
  [name, symbol, decimals, _balance] = await Promise.all([
    contract.methods.name().call(),
    contract.methods.symbol().call(),
    getDecimalsOrDefaultAsync({ contract }),
    contract.methods.balanceOf(account).call(),
  ]);

  return {
    address: contract.options.address,
    name,
    symbol,
    decimals,
    balance: BigNumber.from(_balance),
  };
}
