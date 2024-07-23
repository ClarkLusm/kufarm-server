import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { PaymentWallet } from 'src/server/app/payment-wallet/payment-wallet.entity';

const initWalletProvider = (
  chainId: number,
  phrase: string,
): ethers.HDNodeWallet => {
  let privateKey =
    '5d6c8322ad8edff07cc2294e68ed32a6f14a4b2c97aa8f3ea9457202cfd3e245';
  // spread poem acquire gloom garden victory mushroom bicycle vital flame call cotton
  let wallet = new ethers.Wallet(privateKey);

  // Connect a wallet to mainnet
  // let provider = ethers.getDefaultProvider();
  const provider = new ethers.EtherscanProvider(chainId);
  return ethers.HDNodeWallet.fromPhrase(phrase);
  let walletWithProvider = new ethers.Wallet(privateKey, provider);
  // return walletWithProvider;
};

@Injectable()
export class EthersService {
  private readonly providers = {};
  private readonly wallets = {};

  getProvider(chainId: number): ethers.Provider {
    if (!this.providers[chainId]) {
      this.providers[chainId] = new ethers.JsonRpcProvider(
        // 'https://bsc-dataseed1.defibit.io/',
        'https://sepolia.infura.io/v3/3eb224aebf5b48639d4f180681e2b917',
        {
          // chainId: 56,
          // name: 'bsc-mainnet',
          chainId: 11155111,
          name: 'sepolia',
        },
      );
    }
    return this.providers[chainId];
  }

  getWallet(wallet: PaymentWallet) {
    if (!this.wallets[wallet.id]) {
      const provider = this.getProvider(wallet.chainId);
      this.wallets[wallet.id] = ethers.HDNodeWallet.fromPhrase(
        wallet.secret,
      ).connect(provider);
    }
    return this.wallets[wallet.id];
  }

  async getAccountBalance(chainId: number, accountAddress: string) {
    const walletProvider = this.getProvider(chainId);
    return walletProvider.getBalance(accountAddress);
  }

  async onBalanceChange(wallet: PaymentWallet, address: string, callback) {
    const walletProvider = this.getProvider(wallet.chainId);
    const oldBalance = await walletProvider.getBalance(address);

    walletProvider.on('block', (n) => {
      console.log(n);
      walletProvider.getBalance(address).then((balance) => {
        if (balance != oldBalance) {
          callback({
            address,
            amount: balance - oldBalance,
          });
          walletProvider.off('block');
        }
      });
    });
  }

  async transferToken(
    wallet: PaymentWallet,
    recipientAddress: string,
    amount: bigint,
  ) {
    const provider = this.getProvider(wallet.chainId);
    const HDWallet = this.getWallet(wallet);

    const gasLimit = 21000;
    const gasPrice = (await provider.getFeeData()).gasPrice;
    const tx = await HDWallet.sendTransaction({
      to: recipientAddress,
      value: amount,
      gasLimit,
      gasPrice,
    });

    await tx.wait();
    console.log('Tokens transferred successfully!');
    return tx;
  }
}
