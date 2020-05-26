const axios = require('axios');
const shopifyConstants = require('./shopifyConstants.js');
const checkoutService = require('./checkoutService.js');

const startShopifyBot = (pageNumber) => {
  axios.get(shopifyConstants.featureUrl + 'products.json?limit=100&page=' + pageNumber)
  .then(response => {
    getAvailability(response.data.products, pageNumber);
  })
  .catch(error => {
    console.log(error);
  });
}

function getAvailability(data, pageNumber) {
    if (data.length == 0) {
      console.log('not found');
      return;
    }

    var found = false;
    var id = '';
    var j = data.length - 1;
    for (var i = 0; i < data.length; i++) {
      // for now was just hardcoding single product to find.
      // TODO: read the product title from a user input
      if (data[i].title.includes('Needles 7 Cuts College S/S Tee')) {
        found = true;
        id = data[i].variants[0].id;
        break;
      }
      if (data[j].title.includes('Needles 7 Cuts College S/S Tee')) {
        found = true;
        id = data[j].variants[0].id;
        break;
      }

      if (i == j) {
        break;
      }
      j--;
    }

    if (!found) {
      startShopifyBot(pageNumber + 1);
    } else {
      console.log('found');
      checkoutService.addProductToCart(id);
    }
}

exports.startShopifyBot = startShopifyBot;