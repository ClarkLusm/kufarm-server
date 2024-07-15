import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

const initWalletProvider = () => {
  let privateKey =
    '0x0123456789012345678901234567890123456789012345678901234567890123';
  let wallet = new ethers.Wallet(privateKey);

  // Connect a wallet to mainnet
  let provider = ethers.getDefaultProvider();
  let walletWithProvider = new ethers.Wallet(privateKey, provider);
  return walletWithProvider;
};

@Injectable()
export class EthersService {
  private readonly providers = {};

  getWalletProvider(walletId: string) {
    if (!this.providers[walletId]) {
      this.providers[walletId] = initWalletProvider();
    }
    return this.providers[walletId];
  }

  onBalanceChange(walletId: string, address: string, callback) {
    const walletProvider = this.getWalletProvider(walletId);
    const oldBalance = walletProvider.getBalance(address);
    walletProvider.on('block', () => {
      walletProvider.getBalance(address).then((balance) => {
        if (balance > oldBalance) {
          callback(balance);
        }
      });
    });
  }
}
