const axios = require('axios');
const shopifyConstants = require('./shopifyConstants.js');
const BlueBird = require('bluebird');
const Http = BlueBird.promisify(require('req-fast'));
let checkoutService = new (require('./checkoutService.js'))();

let startShopifyBot = async (pageNumber) => {
  try {
    let queryParams = {
      "limit": 100,
      "page": pageNumber
    }
    let productListResult = await Http({
      uri: shopifyConstants.featureUrl + 'products.json',
      trackCookie: true,
      method: "GET",
      data: queryParams,
      headers: {
          accept: "application/json, text/html, text/*, application/*"
      }
    });
    await getAvailability(productListResult.body.products, pageNumber);
    // axios.get(shopifyConstants.featureUrl + 'products.json?limit=100&page=' + pageNumber)
    // .then(response => {
    //   console.log('searching on page: ' + pageNumber);
    //    getAvailability(response.data.products, pageNumber);
    // })
    // .catch(error => {
    //   console.log(error);
    // });
  } catch (Error) {

  }
  
  
}

let getAvailability = async (data, pageNumber) => {
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
      if (data[i].title.includes('Feature Spike Trucker Hat V2 - Navy/Yellow')) {
        found = true;
        id = data[i].variants[0].id;
        break;
      }
      if (data[j].title.includes('Feature Spike Trucker Hat V2 - Navy/Yellow')) {
        found = true;
        id = data[j].variants[0].id;
        break;
      }

      if (i == j) {
        break;
      }
      j--;
    }

    try {
      if (!found) {
        await startShopifyBot(pageNumber + 1);
      } else {
        console.log('found id: ' + id);
        await checkoutService.AddToCart(id);
      }
    } catch(E) {

    }
}

exports.startShopifyBot = startShopifyBot;