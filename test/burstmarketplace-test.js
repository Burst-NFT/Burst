const BurstNFT = artifacts.require('BurstNFT');
const BurstMarketplace = artifacts.require('BurstMarketplace');
const TestToken1 = artifacts.require('TestToken1');
const TestToken2 = artifacts.require('TestToken2');
const TestToken3 = artifacts.require('TestToken3');

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract('BurstNFT', (accounts) => {

  it('should create a BurstNFT, create an order on a marketplace', async () => {
    //deploy BurstNFT contract
    const BurstNFTInstance = await BurstNFT.deployed();
    const BurstMarketplaceInstance = await BurstMarketplace.deployed();

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

    const orderPrice = new BN(20000000000000000);

    // create marketorder
    await BurstMarketplaceInstance.createMarketplaceOrder(0, "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", orderPrice);

    // console log the market place order info
    const marketplaceOrderInfo = await BurstMarketplaceInstance.tokenIdToActiveMarketplaceOrders(0);
    console.log(marketplaceOrderInfo);

    await BurstNFTInstance.approve(BurstMarketplaceInstance.address, 0)

    // define account two confirms the active market order
    await accountTwo.send(BurstMarketplaceInstance)
    await BurstMarketplaceInstance.confirmMarketplaceOrder(0, orderPrice, {from : accounts[1]});

    
    const finalEthBalanceAccountOne = await web3.eth.getBalance(accountOne);
    const finalEthBalanceaccountTwo = await web3.eth.getBalance(accountTwo);

    expect(finalEthBalanceAccountOne).to.be.a.bignumber.equal(initialEthBalanceAccountOne.add(orderPrice))


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