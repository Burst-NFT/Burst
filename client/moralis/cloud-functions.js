/* global Moralis:readonly */

// Cloud functions
Moralis.Cloud.define('searchMarketplaceOrderOnAssetMetadata', async (request) => {
  const query = new Moralis.Query('BurstMarketplaceOrder');
  query.exists('burstTokenId');
  query.exists('assetMetadata');
  // if (request.params.searchInput) {
  //   query.fullText('assetMetadata', request.params.searchInput);
  // }

  const pipeline = [
    // join on burstTokenId
    {
      lookup: {
        from: 'BurstAsset',
        localField: 'burstTokenId',
        foreignField: 'burstTokenId',
        as: 'assets',
      },
    },
  ];

  const logger = Moralis.Cloud.getLogger();
  try {
    const result = await query.aggregate(pipeline);
    return result;
  } catch (error) {
    console.error('Got an error ' + error.code + ' : ' + error.message);
    logger.info(error);
  }
});

Moralis.Cloud.define('burstIsInMarketplace', async (request) => {
  const query = new Moralis.Query('BurstMarketplaceOrder');
  query.equalTo('burstTokenId', request.params.burstTokenId);
  const result = await query.first();
  return !!result;
});

// TRIGGERS: BURST NFT
Moralis.Cloud.afterSave('BurstDestroyedEvent', async (request) => {
  const logger = Moralis.Cloud.getLogger();
  try {
    const tokenId = request.object.get('tokenId');
    const burstTokenId = Moralis.Web3.utils.isHex(tokenId) ? Moralis.Web3.utils.hexToNumberString(tokenId) : tokenId;

    const burstAssetQuery = new Moralis.Query('BurstAsset');
    burstAssetQuery.equalTo('burstTokenId', burstTokenId);
    const burstAssets = await burstAssetQuery.find();
    const asyncTasks = burstAssets.map((burstAsset) => {
      burstAsset.unset('symbol');
      burstAsset.unset('name');
      burstAsset.unset('balance');
      burstAsset.unset('address');
      burstAsset.unset('burstTokenId');
      burstAsset.unset('isInMarketplace');
      return burstAsset.save();
    });
    await Promise.all(asyncTasks);
  } catch (error) {
    console.error('Got an error ' + error.code + ' : ' + error.message);
    logger.info(error);
  }
});

// TRIGGERS: BURST Marketplace
Moralis.Cloud.afterSave('MarketplaceOrderCreatedEvent', async (request) => {
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
    const BurstMarketplace = Moralis.Object.extend('BurstMarketplaceOrder');

    // Add/update record in BurstMarketplace
    const burstMarketplaceQuery = new Moralis.Query('BurstMarketplaceOrder');
    burstMarketplaceQuery.equalTo('burstTokenId', burstTokenId);
    const burstMarketplaceOrder = (await burstMarketplaceQuery.first()) || new BurstMarketplace();
    burstMarketplaceOrder.set('burstTokenId', burstTokenId);
    burstMarketplaceOrder.set('maker', request.object.get('maker'));
    burstMarketplaceOrder.set('paymentToken', request.object.get('paymentToken'));
    burstMarketplaceOrder.set('price', request.object.get('price'));
    burstMarketplaceOrder.set('address', request.object.get('address'));
    burstMarketplaceOrder.set('marketplaceOrderCreatedEventId', request.object.get('objectId'));
    burstMarketplaceOrder.set('assetMetadata', JSON.stringify(burstAssets.map((a) => `${a.get('name')}|${a.get('symbol')}|${a.get('address')}`)));

    // add save task to array of async tasks
    asyncTasks.push(burstMarketplaceOrder.save());

    // execute all async tasks
    await Promise.all(asyncTasks);
  } catch (error) {
    console.error('Got an error ' + error.code + ' : ' + error.message);
    logger.info(error);
  }
});

Moralis.Cloud.afterSave('MarketplaceOrderFilledEvent', async (request) => {
  const logger = Moralis.Cloud.getLogger();
  try {
    const tokenId = request.object.get('tokenId');
    const burstTokenId = Moralis.Web3.utils.isHex(tokenId) ? Moralis.Web3.utils.hexToNumberString(tokenId) : tokenId;
    logger.info(`MarketplaceOrderFilledEvent - ${burstTokenId}`);
    // Add/update record in BurstMarketplace
    // Grab order
    const burstMarketplaceQuery = new Moralis.Query('BurstMarketplaceOrder');
    burstMarketplaceQuery.equalTo('burstTokenId', burstTokenId);
    const burstMarketplaceOrder = await burstMarketplaceQuery.first();

    logger.info(JSON.stringify(burstMarketplaceOrder, null, 2));
    // if order exists then "destroy it" and set BurstAssets to not in marketplace
    if (burstMarketplaceOrder) {
      // DESTROY NOT WORKING SO HAVE TO RESORT TO UNSETTING VARIABLES
      // const result = await burstMarketplaceOrder.destroy();
      burstMarketplaceOrder.unset('burstTokenId');
      burstMarketplaceOrder.unset('assetMetadata');

      await burstMarketplaceOrder.save();

      // Remove burst assets from marketplace by false flag
      const burstAssetQuery = new Moralis.Query('BurstAsset');
      burstAssetQuery.equalTo('burstTokenId', burstTokenId);
      const burstAssets = await burstAssetQuery.find();
      const asyncTasks = burstAssets.map((burstAsset) => {
        burstAsset.set('isInMarketplace', false);
        return burstAsset.save();
      });
      await Promise.all(asyncTasks);
    }
  } catch (error) {
    console.error('Got an error ' + error.code + ' : ' + error.message);
    logger.info(error);
  }
});
Moralis.Cloud.afterSave('MarketplaceOrderCanceledEvent', async (request) => {
  const logger = Moralis.Cloud.getLogger();
  try {
    const tokenId = request.object.get('tokenId');
    const burstTokenId = Moralis.Web3.utils.isHex(tokenId) ? Moralis.Web3.utils.hexToNumberString(tokenId) : tokenId;

    // Grab order
    const burstMarketplaceQuery = new Moralis.Query('BurstMarketplaceOrder');
    burstMarketplaceQuery.equalTo('burstTokenId', burstTokenId);
    const burstMarketplaceOrder = await burstMarketplaceQuery.first();

    // if order exists then "destroy it" and set BurstAssets to not in marketplace
    if (burstMarketplaceOrder) {
      // DESTROY NOT WORKING SO HAVE TO RESORT TO UNSETTING VARIABLES
      // const result = await burstMarketplaceOrder.destroy();
      burstMarketplaceOrder.unset('burstTokenId');
      burstMarketplaceOrder.unset('assetMetadata');

      await burstMarketplaceOrder.save();

      // Remove burst assets from marketplace by false flag
      const burstAssetQuery = new Moralis.Query('BurstAsset');
      burstAssetQuery.equalTo('burstTokenId', burstTokenId);
      const burstAssets = await burstAssetQuery.find();
      const asyncTasks = burstAssets.map((burstAsset) => {
        burstAsset.set('isInMarketplace', false);
        return burstAsset.save();
      });
      await Promise.all(asyncTasks);
    }
  } catch (error) {
    console.error('Got an error ' + error.code + ' : ' + error.message);
    logger.info(error);
  }
});
