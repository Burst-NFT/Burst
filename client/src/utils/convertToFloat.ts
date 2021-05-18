import { formatUnits } from '@ethersproject/units';

// This looks messy, only to return a number since toPrecision returns a string
const convertToFloat = ({ value, decimals = 18, precision = 4 }: { value?: number | string; decimals?: number; precision?: number }): number => {
  let numberStr = '';
  if (value) numberStr = parseFloat(formatUnits(`${value}`, decimals)).toPrecision(precision);
  return numberStr ? parseFloat(numberStr) : 0;
};

export { convertToFloat };
