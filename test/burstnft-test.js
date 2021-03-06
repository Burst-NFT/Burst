const BurstNFT = artifacts.require('BurstNFT');
const TestToken1 = artifacts.require('TestToken1');
const TestToken2 = artifacts.require('TestToken2');
const TestToken3 = artifacts.require('TestToken3');

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract('BurstNFT', (accounts) => {

  it('should create a BurstNFT, transfer a BurstNFT and destory BurstNFT correctly', async () => {
    //deploy BurstNFT contract
    const BurstNFTInstance = await BurstNFT.deployed();

    //deploy test erc20 contracts
    const TestToken1Instance = await TestToken1.deployed();

    // setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];
    
    // define the number of NFT held by the account before creating an NFT (should be 0)
    const accountOneNFTStartingBalance = await BurstNFTInstance.balanceOf(accountOne);
    const accountTwoNFTStartingBalance = await BurstNFTInstance.balanceOf(accountTwo);

    // define the total supply of each erc20 token, to be used for approval
    const TestToken1TotalSupply = await TestToken1Instance.totalSupply();

    // approve transfering erc20 by the BurstNFT contract
    await TestToken1Instance.increaseAllowance(BurstNFT.address,TestToken1TotalSupply);
 
    // define the amount of each erc20 to desposit for the BrustNFT creation
    const TestToken1Amount = new BN(10000);

    // create a BurstNFT using 3 different erc20 tokens 
    await BurstNFTInstance.createBurst(
      [ TestToken1.address ],
      [ TestToken1Amount ],
      "fakeURI"
    );

    // console log the current info for the created NFT
    const NftInfo = await BurstNFTInstance.getBurstNftInfo(0);
    console.log(NftInfo);
    
    // define the number of NFT held by the account after creating an NFT (should be 1)
    const accountOneNFTInterimBalance = new BN(await BurstNFTInstance.balanceOf(accountOne));
    
    // expect the NFT count in the account one to be 1
    expect(accountOneNFTInterimBalance).to.be.a.bignumber.equal(new BN (1).add(new BN(accountOneNFTStartingBalance)));

    // transfer the NFT from account one to account two
    await BurstNFTInstance.transferFrom(accountOne,accountTwo, 0);

    // define the number of NFT held by the account one after transferring an NFT 
    const accountOneNFTEndingBalance = new BN(await BurstNFTInstance.balanceOf(accountOne));

    // define the number of NFT held by the account two after transferring an NFT (should be 1)
    const accountTwoNFTInterimBalance = new BN(await BurstNFTInstance.balanceOf(accountTwo));
    
    // expect the NFT count in the account one to be 0
    expect(accountOneNFTEndingBalance).to.be.a.bignumber.equal(accountOneNFTStartingBalance);
    
    // expect the NFT count in the account two to be 1
    expect(accountTwoNFTInterimBalance).to.be.a.bignumber.equal(accountTwoNFTStartingBalance.add(new BN (1)));
    
    // expect the NFT owner to be account two
    expect(await BurstNFTInstance.ownerOf(0)).equal(accountTwo)

    // destroy the NFT
    await BurstNFTInstance.destroyBurst(0, { from: accounts[1] });

    // define the number of NFT held by the account two after destroying an NFT (should be 0)
    const accountTwoNFTEndingBalance = new BN(await BurstNFTInstance.balanceOf(accountTwo));
    
    // expect the NFT count in the account two to be 0
    expect(accountTwoNFTEndingBalance).to.be.a.bignumber.equal(accountTwoNFTStartingBalance);

  });

});
