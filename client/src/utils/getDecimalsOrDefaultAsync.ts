export const getDecimalsOrDefaultAsync = async ({ contract, defaultDecimals = 18 }: { contract: any; defaultDecimals?: number }): Promise<number> => {
  try {
    const _decimals: string = await contract.methods.decimals().call();
    if (_decimals) return parseFloat(_decimals);
  } catch (err) {
    // ignore err for now
  }
  return defaultDecimals;
};
