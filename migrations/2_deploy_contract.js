const BurstNFT = artifacts.require('BurstNFT');
const BurstMarketplace = artifacts.require('BurstMarketplace');
const TestToken1 = artifacts.require('TestToken1');
const TestToken2 = artifacts.require('TestToken2');
const TestToken3 = artifacts.require('TestToken3');
require('dotenv').config({ path: '../.env' });

const INITIAL_CREATORFEE = '2';
const INITIAL_PROTOCOLFEE = '2';

module.exports = async (deployer) => {
  await deployer.deploy(BurstNFT, process.env.GOVERNANCE, INITIAL_CREATORFEE, 'https://ipfs.moralis.io:2053/ipfs/', {
    from: process.env.DEPLOY_ADDRESS,
  });
  await deployer.deploy(BurstMarketplace, process.env.GOVERNANCE, INITIAL_PROTOCOLFEE, process.env.RECIPIENTADDRESS, BurstNFT.address, {
    from: process.env.DEPLOY_ADDRESS,
  });
  await deployer.deploy(TestToken1, '100000000000000000000000', { from: process.env.DEPLOY_ADDRESS });
  await deployer.deploy(TestToken2, '100000000000000000000000', { from: process.env.DEPLOY_ADDRESS });
  await deployer.deploy(TestToken3, '100000000000000000000000', { from: process.env.DEPLOY_ADDRESS });
  const BurstNFTInstance = await BurstNFT.deployed();
  await BurstNFTInstance.setBurstMarketplaceAddress(BurstMarketplace.address, { from: process.env.DEPLOY_ADDRESS });
};
