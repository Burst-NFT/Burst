const BurstNFT = artifacts.require('BurstNFT');

module.exports = function (deployer) {
  deployer.deploy(BurstNFT);
};
