const BurstNFT = artifacts.require('BurstNFT');
const TestToken1 = artifacts.require('TestToken1');
const TestToken2 = artifacts.require('TestToken2');
const TestToken3 = artifacts.require('TestToken3');

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract('BurstNFT', (accounts) => {

  it('should create BurstNFT correctly', async () => {
    //deploy BurstNFT contract
    const BurstNFTInstance = await BurstNFT.deployed();

    //deploy test erc20 contracts
    const TestToken1Instance = await TestToken1.deployed();
    // const TestToken2Instance = await TestToken2.deployed();
    // const TestToken3Instance = await TestToken3.deployed();

    // setup 1 accounts.
    const accountOne = accounts[0];
    
    // define the number of NFT held by the account before creating an NFT (should be 0)
    const accountOneNFTStartingBalance = await BurstNFTInstance.balanceOf(accountOne);

    // define the balance of erc20 tokens held by the account before creating an NFT
    // const accountOneTT1StartingBalance = new BN(await TestToken1Instance.balanceOf(accountOne));
    // const accountOneTT2StartingBalance = new BN(await TestToken2Instance.balanceOf(accountOne));
    // const accountOneTT3StartingBalance = new BN(await TestToken3Instance.balanceOf(accountOne));

    // define the total supply of each erc20 token, to be used for approval
    const TestToken1TotalSupply = await TestToken1Instance.totalSupply();
    // const TestToken2TotalSupply = await TestToken2Instance.totalSupply();
    // const TestToken3TotalSupply = await TestToken3Instance.totalSupply();

    // approve transfering erc20 by the BurstNFT contract
    await TestToken1Instance.increaseAllowance(BurstNFT.address,TestToken1TotalSupply);
    // await TestToken2Instance.increaseAllowance(BurstNFT.address,TestToken2TotalSupply);
    // await TestToken3Instance.increaseAllowance(BurstNFT.address,TestToken3TotalSupply);

    // define the amount of each erc20 to desposit for the BrustNFT creation
    const TestToken1Amount = new BN(10000);
    // const TestToken2Amount = new BN(20000);
    // const TestToken3Amount = new BN(30000);

    // create a BurstNFT using 3 different erc20 tokens 
    await BurstNFTInstance.createBurstWithMultiErc20(
      [ TestToken1.address ],
      [ TestToken1Amount ]
    );
    
    // Define the number of NFT held by the account after creating an NFT (should be 1)
    const accountOneNFTEndingBalance = new BN(await BurstNFTInstance.balanceOf(accountOne));

    // define the balance of erc20 tokens held by the account after creating an NFT (should be less)
    // const accountOneTT1EndingBalance = new BN(await TestToken1Instance.balanceOf(accountOne));
    // const accountOneTT2EndingBalance = new BN(await TestToken2Instance.balanceOf(accountOne));
    // const accountOneTT3EndingBalance = new BN(await TestToken3Instance.balanceOf(accountOne));

    // assert.equal(accountOneNFTEndingBalance, accountOneNFTStartingBalance.add(NFTAmount), "NFT was not created");
    expect(accountOneNFTEndingBalance).to.be.a.bignumber.equal(new BN (1).add(new BN(accountOneNFTStartingBalance)));
    // assert.equal(accountOneTT1StartingBalance, accountOneTT1EndingBalance.add(TestToken1Amount), "TestToken1 was not deposited");
    // assert.equal(accountOneTT2StartingBalance, accountOneTT2EndingBalance.add(TestToken2Amount), "TestToken1 was not deposited");
    // assert.equal(accountOneTT3StartingBalance, accountOneTT3EndingBalance.add(TestToken3Amount), "TestToken1 was not deposited");
    // assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });

});
