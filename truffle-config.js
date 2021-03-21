const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const AccountIndex = 0;
require('dotenv').config({ path: './.env' });

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777',
    },
    kovan_infura: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://kovan.infura.io/v3/' + process.env.KOVANKEY, AccountIndex),
      network_id: 42,
    },
    matic_mumbai: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    matic_mainnet: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rpc-mainnet.matic.network`),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '^0.7.4',
    },
  },
};
