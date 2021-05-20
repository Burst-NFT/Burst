const BurstNFT = artifacts.require('BurstNFT');
const BurstMarketplace = artifacts.require('BurstMarketplace');
const TestToken1 = artifacts.require('TestToken1');
const TestToken2 = artifacts.require('TestToken2');
const TestToken3 = artifacts.require('TestToken3');
require("dotenv").config({path: "../.env"});

const INITIAL_CREATORFEE = '2';
const INITIAL_PROTOCOLFEE = '2';

module.exports = async (deployer) => {
  await deployer.deploy(BurstNFT, process.env.GOVERNANCE, INITIAL_CREATORFEE, 'https://gateway.pinata.cloud/ipfs/');
  await deployer.deploy(BurstMarketplace, process.env.GOVERNANCE, INITIAL_PROTOCOLFEE, process.env.RECIPIENTADDRESS, BurstNFT.address);
  await deployer.deploy(TestToken1, '100000000000000000000000');
  await deployer.deploy(TestToken2, '100000000000000000000000');
  await deployer.deploy(TestToken3, '100000000000000000000000');
};
