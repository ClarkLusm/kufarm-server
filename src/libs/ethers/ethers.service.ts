import { ethers } from 'ethers';
import path from 'path';
import fs from 'fs';

import { NETWORKS } from '../../common/constants';
import { getContractToken } from '../../common/helpers/token.helper';
import { PaymentWallet } from '../../modules/payment-wallets/payment-wallet.entity';

export class EthersService {
  getTheAbi = (chainId: number, coin: string) => {
    try {
      const dir = path.resolve(
        __dirname,
        '..',
        `abis/${coin}.${chainId}.abi.json`,
      );
      const file = fs.readFileSync(dir, 'utf8');
      const abi = JSON.parse(file);
      return abi;
    } catch (e) {
      console.log(`e`, e);
    }
  };

  private async getProvider(chainId: number) {
    const network = NETWORKS[chainId];
    return new ethers.JsonRpcProvider(network.rpcUrl);
  }

  private async getEthersContractToken(
    chainId: number,
    coin: string,
    privateKey?: string,
  ) {
    const token = getContractToken(chainId, coin);
    if (!token) throw new Error(`The network does not support ${coin}`);
    const provider = await this.getProvider(chainId);
    const abi = await this.getTheAbi(chainId, coin);
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey, provider);
      return new ethers.Contract(token.address, abi, wallet);
    }
    return new ethers.Contract(token.address, abi, provider);
  }

  public async getBalance(chainId: number, address: string, coin: string) {
    try {
      const contractToken = await this.getEthersContractToken(chainId, coin);
      const balance = await contractToken.balanceOf(address);
      const decimals = await contractToken.decimals();
      const formattedBalance = ethers.formatUnits(balance, decimals);
      return {
        balance,
        decimals,
        formattedBalance,
      };
    } catch (error) {
      console.error('ERROR::getTokenBalance', error);
      throw error;
    }
  }

  async sendBTCO2Token(
    wallet: PaymentWallet,
    recipientAddress: string,
    amount: string,
  ) {
    const contract = await this.getEthersContractToken(
      wallet.chainId,
      wallet.coin,
      wallet.secret,
    );
    const tx = await contract.transfer(
      recipientAddress,
      ethers.parseUnits(amount, 18),
    );
    await tx.wait();
    return tx;
  }
}
