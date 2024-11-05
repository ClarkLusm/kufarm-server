export const numberToBigInt = (num: number, decimal: number): BigInt => {
  const numStr = num.toString();
  const countDecimals = numStr.split('.')?.[1]?.length || 0;
  const numInt = Math.round(num * Math.pow(10, countDecimals));
  return BigInt(numInt) * BigInt(10 ** (decimal - countDecimals));
};
