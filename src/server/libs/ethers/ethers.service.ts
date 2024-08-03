import { ethers } from 'ethers';
import BITCO2AbiTestnet from './BTCO2_test.abi.json';
import BITCO2AbiMainnet from './BTCO2_main.abi.json';
import USDTAbiTestnet from './USDT_test.abi.json';
import USDTAbiMainnet from './USDT_main.abi.json';
import { TOKENS } from 'src/server/common/constants';

export class EthersService {
  private provider: ethers.JsonRpcApiProvider;
  private tokenContract: ethers.Contract;
  private BITCO2ABI =
    process.env.NODE_ENV === 'production' ? BITCO2AbiMainnet : BITCO2AbiTestnet;
  private USDTABI =
    process.env.NODE_ENV === 'production' ? USDTAbiMainnet : USDTAbiTestnet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.NETWORK_RPC_URL);
  }

  public async getBalance(address: string, coin: string) {
    if (coin === TOKENS.BTCO2.symbol) {
      return this.getBITCO2Balance(address);
    }
    if (coin === TOKENS.USDT.symbol) {
      return this.getUSDTBalance(address);
    }
  }

  private async getBITCO2Balance(address: string) {
    try {
      this.tokenContract = new ethers.Contract(
        process.env.TOKEN_CONTRACT_ADDRESS,
        this.BITCO2ABI,
        this.provider,
      );
      const balance = await this.tokenContract.balanceOf(address);
      const decimals = await this.tokenContract.decimals();
      const symbol = await this.tokenContract.symbol();
      const formattedBalance = ethers.formatUnits(balance, decimals);
      return {
        balance,
        decimals,
        symbol,
        formattedBalance,
      };
    } catch (error) {
      console.error('ERROR::getTokenBalance', error);
      throw error;
    }
  }

  async sendBTCO2Token(
    privateKey: string,
    recipientAddress: string,
    amount: string,
  ) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contract = new ethers.Contract(
      process.env.TOKEN_CONTRACT_ADDRESS,
      this.BITCO2ABI,
      wallet,
    );
    const tx = await contract.transfer(
      recipientAddress,
      ethers.parseUnits(amount, 18),
    );
    await tx.wait();
    return tx;
  }

  private async getUSDTBalance(address: string) {
    try {
      this.tokenContract = new ethers.Contract(
        process.env.USDT_CONTRACT_ADDRESS,
        this.USDTABI,
        this.provider,
      );
      const balance = await this.tokenContract.balanceOf(address);
      const decimals = await this.tokenContract.decimals();
      const symbol = await this.tokenContract.symbol();
      const formattedBalance = ethers.formatUnits(balance, decimals);
      return {
        balance,
        decimals,
        symbol,
        formattedBalance,
      };
    } catch (error) {
      console.error('ERROR::getTokenBalance', error);
      throw error;
    }
  }

  async subBalanceChange(address: string, callback: Function) {
    const contract = new ethers.Contract(
      process.env.USDT_CONTRACT_ADDRESS,
      this.USDTABI,
      this.provider,
    );
    
    // contract.on('Transfer', (from, to, value, event) => {
    //   console.log('Transfer event detected:');
    //   console.log('From:', from);
    //   console.log('To:', to);
    // });

    // contract.on(contract.filters.Transfer(address), (e) => {
    //   console.log('====', e);
      
    // })

  //   Log {
  //     provider: JsonRpcProvider {},
  //     transactionHash: '0x3121c5ea6116912fbf5a2c8a7e4ab22ebfda8c95f054141209be95725cd748d3',
  //     blockHash: '0x4660822654d3f4238c8c68d99887f66f9a9403841cd25f8ddfc51358af501d9a',
  //     blockNumber: 42632866,
  //     removed: false,
  //     address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  //     data: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
  //     topics: [
  //       '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  //       '0x000000000000000000000000807974b411b6b2277d73d3d017f5749fb7bd5e62',
  //       '0x0000000000000000000000000b37d0d50528995072ceadc303c352f3b75f39a6'
  //     ],
  //     index: 11,
  //     transactionIndex: 9
  //   }
  // ]

    this.provider.on('block', async (n) => {
      console.log(n);
      const logs = await this.provider.getLogs({
        fromBlock: n,
        toBlock: 'latest',
        address: process.env.USDT_CONTRACT_ADDRESS,
        topics: [
            ethers.id("Transfer(address,address,uint256)"),
            null,
            [
              ethers.zeroPadValue(address, 32),
            ]
        ]
      })
      if (logs.length) {
        const log = logs[0]
      }
      console.log(logs);
      
    //   const filter = contract.filters.Transfer(address, null, null)
    //   contract.on(filter, (from, to, value, event) => {
    //     console.log("event: ", event);
    // });
      const a = await contract.queryFilter('Transfer', n);
      if (a.length) {
        console.log(a?.[0]?.toJSON().topics);
      }
    })
  }
}
