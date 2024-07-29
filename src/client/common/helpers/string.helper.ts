export const shortAddress = (address) => {
  return address.slice(0, 5) + '...' + address.slice(-5);
};

export const strToNumberFormat = (number: string, formatted?: boolean) => {
  const result = number.replace(/[^0-9,.]/g, '');
  if (formatted) {
    return Number(result).toLocaleString('en-EN');
  }
  return result;
};
