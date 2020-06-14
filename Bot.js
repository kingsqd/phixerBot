const shopifyService = require('./internal/shopifyService.js');

// TODO take in user input and pass desired product to product finder

(async () => {
    await shopifyService.startShopifyBot(0);
    console.log('Finished');
})();
