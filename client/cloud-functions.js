/* global Moralis:readonly */
Moralis.Cloud.define('testCLI', async (request) => {});

Moralis.Cloud.afterSave('MarketplaceOrderCreatedEvents', async (request) => {
  const logger = Moralis.Cloud.getLogger();
  try {
    const tokenId = request.object.get('tokenId');
    const burstTokenId = Moralis.Web3.utils.isHex(tokenId) ? Moralis.Web3.utils.hexToNumberString(tokenId) : tokenId;
    // Update flag in BurstAsset for searching later
    const burstAssetQuery = new Moralis.Query('BurstAsset');
    burstAssetQuery.equalTo('burstTokenId', burstTokenId);
    const burstAssets = await burstAssetQuery.find();

    // set flag and save burstAssets
    let asyncTasks = burstAssets.map((burstAsset) => {
      burstAsset.set('isInMarketplace', true);
      return burstAsset.save();
    });

    // setup, make sure the class is there before querying later
    const BurstMarketplace = Moralis.Object.extend('BurstMarketplace');

    // Add/update record in BurstMarketplace
    const burstMarketplaceQuery = new Moralis.Query('BurstMarketplace');
    burstMarketplaceQuery.equalTo('burstTokenId', burstTokenId);
    const burstMarketplaceOrder = (await burstMarketplaceQuery.first()) || new BurstMarketplace();
    burstMarketplaceOrder.set('burstTokenId', burstTokenId);
    burstMarketplaceOrder.set('maker', request.object.get('maker'));
    burstMarketplaceOrder.set('paymentToken', request.object.get('paymentToken'));
    burstMarketplaceOrder.set('price', request.object.get('price'));
    burstMarketplaceOrder.set('address', request.object.get('address'));
    burstMarketplaceOrder.set('marketplaceOrderCreatedEventId', request.object.get('objectId'));

    // add save task to array of async tasks
    asyncTasks.push(burstMarketplaceOrder.save());

    // execute all async tasks
    await Promise.all(asyncTasks);
  } catch (error) {
    console.error('Got an error ' + error.code + ' : ' + error.message);
    logger.info(error);
  }
});
