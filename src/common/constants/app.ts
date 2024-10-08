export const PAGESIZE_DEFAULT = 20;
export const PAGE_DEFAULT = 1;
export const SORT_DEFAULT = 'updatedAt';
export const ORDER_DEFAULT = 'DESC';
export const SEARCH_DATE_FORMAT = 'YYYY-MM-DD';

// user_product_status
export const USERPRODUCT_EXPIRED = 3;

export const SETTING_REFERRAL_INCOME = 'referral_income';
export const SETTING_SYSTEM = 'systems';

export const BITCO2_DECIMALS = 18;
export const USDT_DECIMALS = 18;

export const ETH_TOKENS = {
  USDT: {
    decimals: 18,
    symbol: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
};

export const BNB_TOKENS = {
  BTCO2: {
    decimals: BITCO2_DECIMALS,
    symbol: 'BTCO2',
    address: '0xb846CAd46411d761d69A7F9c29FA37c7aB157Ce4',
  },
  USDT: {
    decimals: USDT_DECIMALS,
    symbol: 'USDT',
    address: '0x55d398326f99059fF775485246999027B3197955',
  },
};

export const BNB_TESTNET_TOKENS = {
  BTCO2: {
    decimals: BITCO2_DECIMALS,
    symbol: 'BTCO2',
    address: '0x480BD7c61B7D0AD02Ab7c57e4cdab1482A9F43E7',
  },
  USDT: {
    decimals: USDT_DECIMALS,
    symbol: 'USDT',
    address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  },
};

export const SEPOLIA_TOKENS = {
  USDT: {
    decimals: USDT_DECIMALS,
    symbol: 'USDT',
    address: '',
  },
};

export const NETWORKS = {
  1: {
    chainId: 1,
    name: 'Ethereum',
    rpcUrl: 'https://eth.drpc.org',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://etherscan.io/',
    alias: 'ethereum',
    tokens: Object.values(ETH_TOKENS),
  },
  56: {
    chainId: 56,
    name: 'BNB Smart Chain Mainnet',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://bscscan.com/',
    alias: 'binance',
    tokens: Object.values(BNB_TOKENS),
  },
  97: {
    chainId: 97,
    name: 'BNB Smart Chain Testnet',
    rpcUrl: 'https://bsc-testnet-rpc.publicnode.com',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com/',
    alias: 'binance',
    tokens: Object.values(BNB_TESTNET_TOKENS),
  },
  11155111: {
    chainId: 11155111,
    name: 'Ethereum Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/3eb224aebf5b48639d4f180681e2b917',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io/',
    alias: 'sepolia',
    tokens: Object.values(SEPOLIA_TOKENS),
  },
};
