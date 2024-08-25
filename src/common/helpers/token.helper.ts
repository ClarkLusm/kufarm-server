import { NETWORKS } from '../constants';

export const getContractToken = (chainId: number, coin: string) => {
  return NETWORKS[chainId]?.tokens.find((t) => t.symbol === coin);
};
