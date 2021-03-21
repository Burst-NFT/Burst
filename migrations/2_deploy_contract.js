const BurstNFT = artifacts.require('BurstNFT');
const TestToken1 = artifacts.require('TestToken1');
const TestToken2 = artifacts.require('TestToken2');
const TestToken3 = artifacts.require('TestToken3');

module.exports = async (deployer) => {

  await deployer.deploy(BurstNFT);
  await deployer.deploy(TestToken1, "100000000000000000000000");
  await deployer.deploy(TestToken2, "100000000000000000000000");
  await deployer.deploy(TestToken3, "100000000000000000000000");  

};
