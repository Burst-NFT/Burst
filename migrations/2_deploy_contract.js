const BurstNFT = artifacts.require('BurstNFT');
const TestToken1 = artifacts.require('TestToken1');
const TestToken2 = artifacts.require('TestToken2');
const TestToken3 = artifacts.require('TestToken3');

const GOVERNANCE = '0xAb3B30368E7c1f1Fa7aA974E2953804Dfb920D81';
const INITIAL_CREATORFEE = '2';

module.exports = async (deployer) => {
  await deployer.deploy(BurstNFT, GOVERNANCE, INITIAL_CREATORFEE, 'https://gateway.pinata.cloud/ipfs/');
  await deployer.deploy(TestToken1, '100000000000000000000000');
  await deployer.deploy(TestToken2, '100000000000000000000000');
  await deployer.deploy(TestToken3, '100000000000000000000000');
};
