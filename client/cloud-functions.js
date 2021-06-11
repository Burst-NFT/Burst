/* global Moralis:readonly */
Moralis.Cloud.define('testCLI', async (request) => {});

Moralis.Cloud.afterSave('MarketplaceOrderCreatedEvents', async (request) => {
  try {
    const query = new Moralis.Query('BurstAsset');
    query.equalTo('burstTokenId', request.object.tokenId);
    const results = await query.find();
    const updateTasks = results.map((burstAsset) => {
      burstAsset.set('isInMarketplace', true);
      return burstAsset.save();
    });

    await Promise.all(updateTasks);
  } catch (error) {
    console.error('Got an error ' + error.code + ' : ' + error.message);
  }
});
