export const PAGESIZE_DEFAULT = 20;
export const PAGE_DEFAULT = 1;
export const SORT_DEFAULT = 'updatedAt';
export const ORDER_DEFAULT = 'DESC';
export const SEARCH_DATE_FORMAT = 'YYYY-MM-DD';

// user_product_status
export const USERPRODUCT_EXPIRED = 3;

export const SETTING_NEW_USER_PROMOTION = 'new_user_promotion';
export const SETTING_REFERRAL_INCOME = 'referral_income';
export const SETTING_SYSTEM = 'systems';

export const NETWORKS = {
  1: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.drpc.org',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://etherscan.io/',
    alias: 'ethereum',
  },
  56: {
    chainId: 56,
    name: 'BNB Smart Chain Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://bscscan.com/',
    alias: 'binance',
  },
  97: {
    chainId: 97,
    name: 'BNB Smart Chain Testnet',
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com/',
    alias: 'binance',
  },
  11155111: {
    chainId: 11155111,
    name: 'Ethereum Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/3eb224aebf5b48639d4f180681e2b917',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io/',
    alias: 'sepolia',
  },
};

export const TOKENS = {
  BTCO2: {
    decimal: 18,
    symbol: 'BTCO2',
  },
  USDT: {
    decimal: 6,
    symbol: 'USDT',
  },
};

export const DERIVATION_PATH = {
  1: "m/44'/60'/0'/0",
  56: "m/44'/714'/0'/0",
  97: "m/44'/1656'/0'/0",
};
