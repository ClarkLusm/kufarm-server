export const numberToBigInt = (num: number, decimal: number) => {
  return num * Math.pow(10, decimal);
};
